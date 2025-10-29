import { Controller, ControllerProps, FieldPath, FieldValues, UseFormProps } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { ComponentPropsWithoutRef } from "react";
import { Switch } from "../ui/switch";
import * as SwitchPrimitive from "@radix-ui/react-switch"


type BaseProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Pick<ControllerProps<TFieldValues, TName>, 'name' | 'control' | 'rules'> &
    {
        label: string;
        description?: string;
    }

type TextInputProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = BaseProps<TFieldValues, TName> & ComponentPropsWithoutRef<'input'>

type SwitchInputProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = BaseProps<TFieldValues, TName> & React.ComponentProps<typeof SwitchPrimitive.Root>

export function TextInput<T extends FieldValues = FieldValues, U extends FieldPath<T> = FieldPath<T>>({
    label,
    description,
    name,
    control,
    rules,
    ...rest
}: TextInputProps<T, U>) {
    return (
        <Controller
            name={name}
            rules={rules}
            control={control}
            render={({ field, fieldState }) => (
                <Field>
                    <FieldLabel htmlFor={field.name} className="text-lg">{label}</FieldLabel>
                    <Input {...field} {...rest} id={field.name} aria-invalid={fieldState.invalid} placeholder={label} className="text-md"/>
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>

            )}
        />
    );
}

export function SwitchInput<T extends FieldValues = FieldValues, U extends FieldPath<T> = FieldPath<T>>({
    label,
    description,
    name,
    control,
    rules,
    ...rest
}: SwitchInputProps<T, U>) {
    return (
        <Controller
            name={name}
            rules={rules}
            control={control}
            render={({ field, fieldState }) => (
                <Field orientation="vertical" >
                    <FieldLabel htmlFor={field.name} className="text-lg">{label}</FieldLabel>
                    {description && <FieldDescription className="text-md text-gray-800/95" >{description}</FieldDescription>}
                    <Switch
                        id={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                        {...rest}
                        className="max-w-8 data-[state=unchecked]:bg-black"
                    />
                </Field>
            )}
        />
    );
}