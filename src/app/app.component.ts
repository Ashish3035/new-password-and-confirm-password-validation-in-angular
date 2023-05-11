import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  passwordsMatching = false;
  isConfirmPasswordDirty = false;
  confirmPasswordClass = 'form-control';
  newPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),
  ]);
  confirmPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),
  ]);

  resetPasswordForm = this.formBuilder.group(
    {
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    },
    {
      validator: this.ConfirmedValidator('newPassword', 'confirmPassword'),
    }
  );
  isNumber: boolean = false;
  isLowerCase: boolean = false;
  isUpperCase: boolean = false;
  isPassMatch: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  onSubmit(): void {
    console.log(this.resetPasswordForm);
    if (!this.resetPasswordForm?.valid) {
      return;
    }
  }

  get passError() { return this.resetPasswordForm.controls['newPassword'] }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  isMissing(characterType: string) {
    const passwordValue = this.resetPasswordForm.value.newPassword;
    switch (characterType) {
      case 'number':
        this.isNumber = !/\d/.test(passwordValue);
        return !this.isNumber;
      case 'lowercase':
        this.isLowerCase = !/[a-z]/.test(passwordValue) || passwordValue == null;
        return !this.isLowerCase;
      case 'uppercase':
        this.isUpperCase = !/[A-Z]/.test(passwordValue);
        return !this.isUpperCase;
      default:
        return true;
    }
  }

  onInputChange() {
    const a = this.resetPasswordForm.value.newPassword;
    const b = this.resetPasswordForm.value.confirmPassword;

    let len1 = a.length;
    let len2 = b.length;
    if (len1 !== len2) {
      this.isPassMatch = false
    }
    let str1 = a.split('').sort().join('');
    let str2 = b.split('').sort().join('');
    if (str1 === str2) {
      this.isPassMatch = false
    } else {
      this.isPassMatch = true
    }
  }
}
