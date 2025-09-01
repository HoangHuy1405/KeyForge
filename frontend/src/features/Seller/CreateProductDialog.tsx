import { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Stepper, Step, StepLabel
} from "@mui/material";
import { Formik, Form } from "formik";
import CreateBasicStep from "./DialogSteps/CreateBasicStep"
import UpdateDetailStep from "./DialogSteps/UpdateDetailStep";
import { IStepComponent } from "./DialogSteps/IStepComponent";
import { FormikHelpers } from "formik";
import UpdateInventoryStep from "./DialogSteps/UpdateInventoryStep";
import UpdateLogisticsStep from "./DialogSteps/UpdateLogisticStep";
import { useSelector } from "react-redux";
import { getUserId } from "../../redux/slice/accountSlice";
import { toast } from "react-toastify"

export default function CreateProductDialogFormik({ open, onClose }: { open: boolean, onClose: () => void }) {
    const steps: IStepComponent<any>[] = [CreateBasicStep, UpdateDetailStep, UpdateInventoryStep, UpdateLogisticsStep]
    const [activeStep, setActiveStep] = useState(0);
    const [visitedSteps, setVisitedSteps] = useState<boolean[]>(steps.map(() => false));

    const userId = useSelector(getUserId);

    const isLastStep = (): boolean => {
        return activeStep === steps.length - 1;
    };

    const handlePrev = () => {
        setActiveStep(Math.max(activeStep - 1, 0));
    };

    const handleNext = () => [
        setActiveStep(Math.min(activeStep + 1, steps.length - 1))
    ];

    const resetState = () => {
        setActiveStep(0);
        setVisitedSteps(steps.map(() => false));
    };

    const onSubmit = async (values, formikBag: FormikHelpers<any>) => {
        const { setSubmitting, resetForm } = formikBag;

        const CurrentStep = steps[activeStep];

        console.log(values)

        if (!visitedSteps[activeStep]) {
            await CurrentStep.onNextStep(values, formikBag);
        } else {
            if (CurrentStep.onNextStepWhenBack) {
                await CurrentStep.onNextStepWhenBack(values);
            } else {
                await CurrentStep.onNextStep(values, formikBag);
            }
        }



        if (!visitedSteps[activeStep]) {
            const newVisited = [...visitedSteps];
            newVisited[activeStep] = true;
            setVisitedSteps(newVisited);
        }

        if (!isLastStep()) {
            setSubmitting(false);

            handleNext();
            return;
        }


        toast.success("Create product success")
        // Submit
        resetState();
        resetForm();
        onClose();
    };

    const initialValues = {
        ...steps.reduce(
            (values, { initialValues }) => ({
                ...values,
                ...initialValues,
            }),
            {}
        ),
        userId,
    };

    const ActiveStep = steps[activeStep];
    const validationSchema = ActiveStep.validationSchema;

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            validateOnChange={false}
            validateOnBlur={false}
        >
            {(formikProps) => (
                <Dialog
                    open={open}
                    onClose={(event, reason) => {
                        if (reason === "backdropClick" || reason === "escapeKeyDown") {
                            if (!window.confirm("Bạn có chắc muốn thoát không?")) { return; }
                        }
                        onClose();
                    }}
                    fullWidth
                    maxWidth="lg"
                >
                    <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                    <Form>
                        <DialogContent dividers>
                            {/* Stepper */}
                            <Stepper activeStep={activeStep} alternativeLabel>
                                {steps.map((step, index) => (
                                    <Step key={index}>
                                        <StepLabel>{steps[index].label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            {(() => {
                                const CurrentStep = steps[activeStep];
                                return <CurrentStep {...formikProps} />;
                            })()}
                        </DialogContent>

                        <DialogActions>
                            {activeStep > 0 && (
                                <Button onClick={handlePrev} variant="outlined">
                                    Quay lại
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                type="submit"
                            >
                                {isLastStep() ? "Hoàn thành" : "Tiếp tục"}
                            </Button>
                        </DialogActions>
                    </Form>
                </Dialog>
            )}
        </Formik>

    );
}
