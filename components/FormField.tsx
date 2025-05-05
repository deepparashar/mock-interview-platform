import React from 'react'
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

interface FormFieldProp<T extends FieldValues>{
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' |'file'
}

const FormField = ({control,name ,label, placeholder, type= "text"}: FormFieldProp<T>) => (
    <Controller 
    control={control} 
    name={name} 
     render={({ field }) => (

        <FormItem>
            <FormLabel className='text-light-100 font-normal'>{label}</FormLabel>
            <FormControl>
                <Input className='rounded-full min-h-12 px-5 placeholder:text-light-100' placeholder={placeholder} type={type} {...field} />
            </FormControl>
            <FormMessage />
        </FormItem>

    )}
    
  />
)

export default FormField