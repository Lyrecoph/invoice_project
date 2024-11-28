"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Upload: React.FC = () => {
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const formik = useFormik({
    initialValues: { file: null as File | null },
    validationSchema: Yup.object({
      file: Yup.mixed()
        .required('Veuillez sélectionner un fichier CSV ou Excel')
        .test('fileFormat', 'Seuls les fichiers CSV ou Excel sont acceptés', (value) => {
          return value instanceof File &&
            (value.type === 'text/csv' ||
             value.type === 'application/vnd.ms-excel' ||
             value.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        }),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      if (values.file) {
        formData.append('file', values.file);
      }
      
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/invoices/upload/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage({ text: 'Fichier téléchargé avec succès!', type: 'success' });
        resetForm();
      } catch (error) {
        setMessage({ text: 'Erreur lors du téléchargement du fichier.', type: 'error' });
      }
    },
  });
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 20000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-8">Upload CSV/Excel</h1>
      <div className="bg-blue-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <label className="text-lg font-semibold mb-2" htmlFor="file">
            Sélectionner un fichier
          </label>
          <input
            type="file"
            name="file"
            accept=".csv, .xls, .xlsx"
            onChange={(e) => formik.setFieldValue('file', e.currentTarget.files?.[0])}
            className="block w-full p-2 border border-gray-300 rounded"
          />
          {formik.errors.file && formik.touched.file && <p className="text-red-500 mt-1">{formik.errors.file}</p>}
          <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded">
            Télécharger
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 p-2 text-center rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Upload;
