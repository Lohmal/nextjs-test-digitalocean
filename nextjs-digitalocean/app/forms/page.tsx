"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface FormData {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function FormsPage() {
  const [forms, setForms] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch("http://46.101.239.190:3001/api/forms");
        if (response.ok) {
          const data = await response.json();
          setForms(data.data);
        } else {
          setError("Formlar yüklenirken hata oluştu.");
        }
      } catch (error) {
        setError("Sunucuya bağlanırken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleDelete = async (formId: string, formName: string) => {
    const confirmDelete = window.confirm(
      `"${formName}" adlı formu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
    );

    if (!confirmDelete) return;

    setDeleteLoading(formId);
    try {
      const response = await fetch(`http://46.101.239.190:3001/api/forms/${formId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted form from the state
        setForms(forms.filter((form) => form._id !== formId));
      } else {
        setError("Form silinirken hata oluştu.");
      }
    } catch (error) {
      setError("Sunucuya bağlanırken hata oluştu.");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gönderilen Formlar</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Toplam {forms.length} form bulundu</p>
          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md dark:bg-red-800 dark:border-red-600 dark:text-red-100">
            {error}
          </div>
        )}

        {forms.length === 0 && !error ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Henüz hiç form gönderilmemiş.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {forms.map((form) => (
              <div
                key={form._id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{form.name}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(form.createdAt).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(form._id, form.name)}
                    disabled={deleteLoading === form._id}
                    className="ml-4 px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {deleteLoading === form._id ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                        Siliniyor...
                      </div>
                    ) : (
                      "Sil"
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">E-posta:</span>
                    <p className="text-gray-900 dark:text-gray-100">{form.email}</p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mesaj:</span>
                    <p className="text-gray-900 dark:text-gray-100 mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      {form.message}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => handleDelete(form._id, form.name)}
                    disabled={deleteLoading === form._id}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {deleteLoading === form._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
