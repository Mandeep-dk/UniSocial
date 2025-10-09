import React, { useState, useEffect } from "react";
import Quagga from "quagga";
import { useNavigate } from "react-router-dom";
import { DocumentMagnifyingGlassIcon, CheckCircleIcon, XCircleIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth/firebase';

const Verify = () => {
    const [result, setResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isValid, setIsValid] = useState(null);
    const navigate = useNavigate();

    //   useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, async (user) => {
    //       if (user) {
    //          const verify = () => {
    //     if (validate(result)) {
    //         navigate("/Profile");
    //     }
    // }
    //       }
    //     });
    
    //     return () => unsubscribe();
    //   }, []);
    const validate = (id) => {
        const pattern = /^ADTU\/[01]\/(20(1[0-9]|2[0-9]))-(\d{2})\/[A-Z]{4}\/\d+$/;
        return pattern.test(id);
    }

    const verify = () => {
        if (validate(result)) {
            navigate("/Profile", { replace: true }); // Add replace: true here too
        }
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsLoading(true);
        setResult("");
        setIsValid(null);

        const reader = new FileReader();
        reader.onload = () => {
            const dataURL = reader.result;

            Quagga.decodeSingle(
                {
                    src: dataURL,
                    numOfWorkers: 0,
                    inputStream: {
                        size: 1200,
                        singleChannel: true,
                    },
                    decoder: {
                        readers: ["code_128_reader", "ean_reader", "code_39_reader"],
                        locate: true,
                    },
                },
                (decoded) => {
                    setIsLoading(false);
                    if (decoded && decoded.codeResult) {
                        const scannedCode = decoded.codeResult.code;
                        setResult(scannedCode);
                        setIsValid(validate(scannedCode));
                    } else {
                        setResult("No barcode detected. Please try a clearer or larger image.");
                        setIsValid(false);
                    }
                }
            );
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto h-16 w-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                        <DocumentMagnifyingGlassIcon className="h-8 w-8 text-rose-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Student ID Verification</h1>
                    <p className="text-gray-600">Upload an image of your student ID barcode to verify your identity</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Upload Section */}
                    <div className="p-8">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Upload Barcode Image
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 file:cursor-pointer cursor-pointer border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                    disabled={isLoading}
                                />
                                {isLoading && (
                                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-600"></div>
                                            <span className="text-sm text-gray-600">Processing...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                Supported formats: JPG, PNG, GIF. For best results, use a clear, well-lit image.
                            </p>
                        </div>

                        {/* Result Section */}
                        {result && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Scan Result
                                </label>
                                <div className={`p-4 rounded-lg border ${
                                    result.includes("No barcode detected")
                                        ? "bg-red-50 border-red-200"
                                        : isValid === true
                                        ? "bg-green-50 border-green-200"
                                        : isValid === false
                                        ? "bg-yellow-50 border-yellow-200"
                                        : "bg-gray-50 border-gray-200"
                                }`}>
                                    <div className="flex items-start space-x-3">
                                        {result.includes("No barcode detected") ? (
                                            <XCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        ) : isValid === true ? (
                                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        ) : isValid === false ? (
                                            <XCircleIcon className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <DocumentMagnifyingGlassIcon className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${
                                                result.includes("No barcode detected")
                                                    ? "text-red-800"
                                                    : isValid === true
                                                    ? "text-green-800"
                                                    : isValid === false
                                                    ? "text-yellow-800"
                                                    : "text-gray-800"
                                            }`}>
                                                {result.includes("No barcode detected") ? "Scan Failed" : 
                                                 isValid === true ? "Valid Student ID" :
                                                 isValid === false ? "Invalid ID Format" : "Scanned Code"}
                                            </p>
                                            <p className={`text-sm mt-1 font-mono break-all ${
                                                result.includes("No barcode detected")
                                                    ? "text-red-600"
                                                    : isValid === true
                                                    ? "text-green-600"
                                                    : isValid === false
                                                    ? "text-yellow-600"
                                                    : "text-gray-600"
                                            }`}>
                                                {result}
                                            </p>
                                            {isValid === false && !result.includes("No barcode detected") && (
                                                <p className="text-xs text-yellow-600 mt-2">
                                                    The scanned code doesn't match the expected student ID format (ADTU/[0-1]/YYYY-YY/XXXX/###).
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={verify}
                                disabled={!isValid || isLoading}
                                className={`px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
                                    isValid && !isLoading
                                        ? "bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                            >
                                {isLoading ? "Processing..." : "Verify & Continue"}
                            </button>
                        </div>
                    </div>

                    {/* Instructions Section */}
                    <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Instructions</h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li className="flex items-start space-x-2">
                                <span className="font-medium text-gray-400">1.</span>
                                <span>Ensure your student ID barcode is clearly visible and well-lit</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="font-medium text-gray-400">2.</span>
                                <span>The barcode should follow the format: ADTU/[0-1]/YYYY-YY/XXXX/###</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="font-medium text-gray-400">3.</span>
                                <span>Upload the image and wait for the verification process to complete</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="font-medium text-gray-400">4.</span>
                                <span>Once verified, click "Verify & Continue" to proceed</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Having trouble? Make sure your image is clear and the barcode is not damaged or obscured.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Verify;