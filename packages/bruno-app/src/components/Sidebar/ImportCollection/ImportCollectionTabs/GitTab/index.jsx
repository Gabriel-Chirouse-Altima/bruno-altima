import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const GitTab = ({ handleSubmit }) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      link: ''
    },
    validationSchema: Yup.object({
      link: Yup.string()
        .min(1, 'must be at least 1 character')
        .max(255, 'must be 255 characters or less')
        .required('Github URL is required')
    }),
    onSubmit: (values) => {
      console.log(values);
      handleSubmit(values);
    }
  });

  return (
    <form className="github-form" onSubmit={formik.handleSubmit}>
      <div>
        <div className="form-group flex gap-1">
          <input
            id="link-github"
            type="text"
            name="link"
            placeholder="Enter Git repository URL"
            className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:outline-none bg-transparent"
            onChange={formik.handleChange}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            value={formik.values.link || ''}
          />
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            type="submit"
          >
            Clone
          </button>
        </div>
        {formik.touched.link && formik.errors.link ? <div className="text-red-500">{formik.errors.link}</div> : null}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 flex items-center">
          <span className="mr-2 text-yellow-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-sparkles"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"></path>
            </svg>
          </span>
          <span>
            Import from Git repository URL is supported by Gaby's <a target="_blank" className="text-blue-500 underline cursor-pointer" href="https://papertoilet.com/">premium plans</a>
          </span>
        </p>
      </div>
    </form>
  );
};

export default GitTab;
