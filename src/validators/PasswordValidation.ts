import { AbstractControl } from '@angular/forms';
export class PasswordValidation {
    static MatchPassword(abControl: AbstractControl){
        let password = abControl.get('password').value;
        let password2 = abControl.get('password2').value;

        if(password !== password2){
            abControl.get('password2').setErrors( {MatchPassword: true})
        } else {
            return null;
        }
    }

}