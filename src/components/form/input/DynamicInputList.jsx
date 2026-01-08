import React from "react";
import Input from "./InputField";

const MAX_INPUTS = 10;

const DynamicInputList = ({
    values = [""],
    onChange,
    placeholder = "Enter value",
    disabled = false,
    error = false,
    success = false,
    hint,
}) => {
    const handleChange = (index, value) => {
        const updated = [...values];
        updated[index] = value;
        onChange(updated);
    };

    const addInput = () => {
        if (values.length < MAX_INPUTS) {
            onChange([...values, ""]);
        }
    };

    const removeInput = (index) => {
        const updated = values.filter((_, i) => i !== index);
        onChange(updated.length ? updated : [""]);
    };

    return (
        <div className="space-y-3">
            {values.map((value, index) => (
                <div key={index} className="flex w-full gap-2">
                    <div className="flex-1">
                        <Input
                            value={value}
                            placeholder={`${placeholder} ${index + 1}`}
                            onChange={(e) => handleChange(index, e.target.value)}
                            disabled={disabled}
                            error={error}
                            success={success}
                            hint={index === values.length - 1 ? hint : null}
                        />
                    </div>

                    {/* Remove Button */}
                    {values.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeInput(index)}
                            className="h-11 rounded-lg border border-gray-300 px-3 text-sm text-red-500 hover:bg-red-50"
                        >
                            −
                        </button>
                    )}

                    {/* Add Button */}
                    {index === values.length - 1 && values.length < MAX_INPUTS && (
                        <button
                            type="button"
                            onClick={addInput}
                            className="h-11 rounded-lg border border-gray-300 px-3 text-sm text-blue-500 hover:bg-blue-50"
                        >
                            +
                        </button>
                    )}
                </div>
            ))}

            {/* Limit Info */}
            <p className="text-xs text-gray-400">
                {values.length}/{MAX_INPUTS} inputs added
            </p>
        </div>
    );
};

export default DynamicInputList;
