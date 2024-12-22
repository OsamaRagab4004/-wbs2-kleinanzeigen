import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { User } from '../models/user';

export class CustomValidators {
  static isUsedValidation(thisContext: any,
    error: ValidationErrors,
    errorMappingFunction: (
      res: any,
      error: ValidationErrors
    ) => ValidationErrors | null,
    validationFunction: () => Observable<Array<User>>
  ): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.valueChanges || control.pristine) {
        return validationFunction.call(thisContext).pipe(
          map((it) => errorMappingFunction.call(thisContext, it, error)),
          first()
        );
      } else {
        return control.valueChanges.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(() => validationFunction.call(thisContext)),
          map((it) => errorMappingFunction.call(thisContext, it, error)),
          first()
        );
      }
    };
  }
}
