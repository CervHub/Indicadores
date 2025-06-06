import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
    currentStep: number;
}

const steps = ['Generado', 'Revisado', 'Cerrado'];

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
    return (
        <div className="overflow-x-auto w-full">
            <ul className="relative grid grid-flow-col auto-cols-fr gap-x-2 min-w-max">
                {steps.map((step, index) => (
                    <li key={index} className="flex items-center gap-x-2 shrink basis-0 flex-1 group">
                        <div className="min-w-7 min-h-7 inline-flex justify-center items-center text-xs align-middle">
                            <span className={`size-7 flex justify-center items-center shrink-0 ${index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'} font-medium rounded-full dark:bg-neutral-700 dark:text-white`}>
                                {index <= currentStep ? <Check className="w-4 h-4" /> : index + 1}
                            </span>
                            <span className="ms-2 block text-sm font-medium text-gray-800 dark:text-white">
                                {step}
                            </span>
                        </div>
                        <div className="w-full h-px flex-1 bg-gray-200 group-last:hidden dark:bg-neutral-700"></div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Stepper;
