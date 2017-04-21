import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef, Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChange,
    SimpleChanges
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';
import { retry } from '../../@utils/misc.utils';
import { OnPushComponent } from './base.component';
import {
    parseJson, shortid, stringifyJson,
    stringifyYaml, tryParseAsObject
}
    from '../../@utils/string.utils';
import { TextMode } from '../../@model/editor';

declare const ace: any;

@Component({
    selector: 'text-editor',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div [id]="id" class="text-editor"
             (window:resize)="onWindowResize($event)"></div>
    `
})
export class TextEditorComponent extends OnPushComponent implements AfterViewInit, OnChanges {
    public id = shortid();

    @Input() public mode: TextMode = TextMode.JSON; // follow ace editor mode
    @Input() public objectMode: boolean; // indicate text should be json/yaml object string
    @Input() public disableAutoDetect: boolean; // do not detect text mode on the fly
    @Input() public lazyInit: boolean = false; // delay init ace editor
    @Input() public emitImmediate: boolean; // emit text change without debounce
    @Input() public debounce: number = 500;

    @Input() public minLines: number = 5;
    @Input() public maxLines: number;
    @Input() public wrap: boolean;
    @Input() public lineNumbers: boolean; // show gutters or not

    @Input() public observeText: boolean; // update text when @Input text changed
    @Input() public text: string;

    @Output() public onTextChanged = new EventEmitter<TextObject>();
    @Output() public onFullScreenChanged = new EventEmitter<any>();

    private isInitializing: boolean;
    private isModeSet: boolean;
    private editor: any; // ace editor
    private session: any; // ace editor session

    private textChanged: Subject<TextObject> = new Subject();
    private textChanged$: Observable<TextObject> = this.textChanged.asObservable()
        .debounceTime(this.debounce)
        .distinctUntilChanged();

    private previousValue: string;
    private isTextInitialized: boolean;

    constructor(private cd: ChangeDetectorRef) {
        super(cd);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        console.debug('text editor change detected', changes);

        let change: SimpleChange = changes['text'];
        if (change && (change.isFirstChange() || this.observeText)) {
            this.setText(this.text);
            if (change.isFirstChange()) this.isTextInitialized = true;
        }

        this.onChange(changes, 'fullScreen', value => {
            this.onWindowResize(50);
        });

        this.onChange(changes, 'mode', value => {
            this.setMode(this.mode, true);
        });

        this.onChange(changes, 'wrap', value => {
            if (this.session)
                this.session.setUseWrapMode(value);
        });

        change = changes['lineNumbers'];
        if (change) {
            if (this.editor) {
                console.debug('updating lineNumbers', change.currentValue);
                this.editor.renderer.setShowGutter(change.currentValue);
            }
        }
    }

    public ngAfterViewInit() {
        if (!this.lazyInit) {
            this.initEditor();
            this.refresh();
        }
    }

    public initEditor() {
        if (this.isInitializing || this.editor || !this.id) return;
        this.isInitializing = true;

        ace.config.set('basePath', 'assets/js/ace');
        // ace.config.set('workerPath', 'assets/js/ace');

        ace.require('ace/ext/language_tools');
        let editor = this.editor = ace.edit(this.id), session = this.session = editor.getSession();
        editor.renderer.setShowGutter(this.lineNumbers);
        editor.setTheme('ace/theme/github');
        editor.setOptions({
            enableSnippets: true,
            // enableLinking: true,
            enableLiveAutocompletion: false,
            enableBasicAutocompletion: true,
            maxLines: this.maxLines,
            minLines: this.minLines,
            fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
            fontSize: '12px'
        });
        editor.on('blur', () => {
            let text = this.getText();
            let isJSON = !!parseJson(text);
            if (text !== this.previousValue) {
                if (this.objectMode) {
                    let object = tryParseAsObject(text);
                    if (object) {
                        let plainText = stringifyJson(object);
                        this.setMode(isJSON ? TextMode.JAVASCRIPT : TextMode.YAML);
                        this.setText(plainText);
                    }
                }

                if (this.isTextInitialized) {
                    console.debug('emitting from blur event', this.getText());
                    this.onTextChanged.emit({ mode: this.mode, text: this.getText() });
                }
            }
        });
        session.setUseWrapMode(this.wrap);
        session.on('change', () => {
            let text = this.getText();
            if (!this.disableAutoDetect) {
                let len = text.length;
                if (len <= 5) delete this.isModeSet;
                if (this.objectMode)
                    this.detectMode(text);
            }

            if (text !== this.previousValue && this.isTextInitialized) {
                // console.debug('text', text, 'pre', this._preValue);
                this.textChanged.next({ mode: this.mode, text });
            }
        });

        this.setMode(this.mode, true);
        this.textChanged$.subscribe(textObject => {
            // textObject = { mode: this.mode, text: this.getText() };
            // console.debug('emitting from change[textChanged$] event', this.getText(), textObject);
            this.onTextChanged.emit({ mode: this.mode, text: this.getText() });
        });
    }

    public exitFullScreen() {
        this.onFullScreenChanged.emit(false);
        this.editor.resize(50);
    }

    public setMode(mode: TextMode, force = false) {
        if (this.session && (force || this.mode !== mode)) {
            console.debug('setting editor mode to ', mode);
            this.session.setMode(`ace/mode/${mode}`);
        }
    }

    public setText(text: string, cursorPosition = -1) {
        retry(() => !!this.editor, () => {
            if (text && _.isObject(text)) {
                text = JSON.stringify(text, null, 2);
                this.setMode(TextMode.JSON);
            }
            this.editor.setValue(text || '', cursorPosition);
            this.previousValue = text || '';
        }, 'textEditor: ' + text);
    }

    public getText() {
        if (this.editor)
            return this.editor.getValue();
    }

    public toYAML() {
        if (this.objectMode) {
            let text = this.getText();
            let object = tryParseAsObject(text);
            if (object) {
                this.setText(stringifyYaml(object));
            }
        }
    }

    public toJSON() {
        if (this.objectMode) {
            let text = this.getText();
            let object = tryParseAsObject(text);
            if (object) {
                this.setText(stringifyJson(object));
            }
        }
    }

    public onWindowResize(delay?: number) {
        if (this.editor) {
            if (!delay)
                this.editor.resize();
            else {
                setTimeout(() => {
                    this.editor.resize();
                }, delay);
            }
        }
    }

    private detectMode(text: string) {
        if (!this.isModeSet && text.length > 5) {
            let isJSON = this.isJson(text);
            this.setMode(isJSON ? TextMode.JAVASCRIPT : TextMode.YAML);
            this.isModeSet = true;
        }
    }

    /**
     * very simple way to guess text is for JSON or not
     * should use only with object mode
     * in which text is either JSON or YAML
     * @param text
     * @returns {boolean}
     */
    private isJson(text: string) {
        return _.trim(text).startsWith('{');
    }
}

export interface TextObject {
    mode: TextMode;
    text: string;
}
