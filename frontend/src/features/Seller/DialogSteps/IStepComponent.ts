import { FC } from "react";
import { FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";

export type IStepComponent<TValues = any> = FC<FormikProps<TValues>> & {
    label: string;
    initialValues: TValues;
    validationSchema: Yup.ObjectSchema<any>;
    visited: boolean;
    onNextStep: (values: TValues, helpers: FormikHelpers<TValues>) => any;
    onNextStepWhenBack?: (values: TValues) => any;
};




