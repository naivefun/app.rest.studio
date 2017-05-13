import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { AlertService } from './@shared/alert.service';
import { ConfigService } from './@shared/config.service';
import { DbService } from './@shared/db.service';
// Load the implementations that should be tested
import { AppComponent } from './app.component';
import { AppState } from './app.service';

describe(`App`, () => {
    let comp: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    // async beforeEach
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AppComponent ],
            imports: [ StoreModule.provideStore({}) ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [ AppState, ConfigService, DbService, AlertService ]
        })
            .compileComponents(); // compile template and css
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.componentInstance;

        fixture.detectChanges(); // trigger initial data binding
    });

    it(`should be readly initialized`, () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });

    it(`should be app.rest.studio`, () => {
        expect(comp.name).toEqual('app.rest.studio');
    });

    it('should log ngOnInit', () => {
        spyOn(console, 'log');
        expect(console.log).not.toHaveBeenCalled();

        comp.ngOnInit();
        expect(console.log).toHaveBeenCalled();
    });

});
