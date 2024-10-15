import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsPasswordMatchConstraint implements ValidatorConstraintInterface {
    validate(confirmPassword: string, args: any) {
        const [relatedPropertyName] = args.constraints;
        const password = (args.object as any)[relatedPropertyName];
        return password === confirmPassword;
    }

    defaultMessage(args: any) {
        return 'Password do not match to confirmed password';
    }
}

export function IsPasswordMatch(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: IsPasswordMatchConstraint,
        });
    };
}