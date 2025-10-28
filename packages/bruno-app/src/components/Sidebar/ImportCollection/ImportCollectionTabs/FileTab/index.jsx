import React, { useRef, useState } from 'react';
import { IconFileImport } from '@tabler/icons';
import { isOpenApiSpec } from 'utils/importers/openapi-collection';
import { isWSDLCollection } from 'utils/importers/wsdl-collection';
import { isPostmanCollection, postmanToBruno } from 'utils/importers/postman-collection';
import { convertInsomniaToBruno, isInsomniaCollection } from 'utils/importers/insomnia-collection';
import { processBrunoCollection } from 'utils/importers/bruno-collection';
import { toastError } from 'utils/common/error';
import jsyaml from 'js-yaml';
import { wsdlToBruno } from '@usebruno/converters';

const convertFileToObject = async (file) => {
  const text = await file.text();

  // Handle WSDL files - return as plain text
  if (file.name.endsWith('.wsdl') || file.type === 'text/xml' || file.type === 'application/xml') {
    return text;
  }

  try {
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      return JSON.parse(text);
    }

    const parsed = jsyaml.load(text);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error();
    }
    return parsed;
  } catch {
    throw new Error('Failed to parse the file – ensure it is valid JSON or YAML');
  }
};

const FileTab = ({ setIsLoading, setShowImportSettings, setOpenApiData, handleSubmit }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    setIsLoading(true);
    try {
      const data = await convertFileToObject(file);

      if (!data) {
        throw new Error('Failed to parse file content');
      }

      // Check if it's an OpenAPI spec and show settings
      if (isOpenApiSpec(data)) {
        setOpenApiData(data);
        setIsLoading(false);
        setShowImportSettings(true);
        return;
      }

      let collection;
      if (isWSDLCollection(data)) {
        collection = await wsdlToBruno(data);
      } else if (isPostmanCollection(data)) {
        collection = await postmanToBruno(data);
      } else if (isInsomniaCollection(data)) {
        collection = convertInsomniaToBruno(data);
      } else {
        collection = await processBrunoCollection(data);
      }

      handleSubmit({ collection });
    } catch (err) {
      toastError(err, 'Import collection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseFiles = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const acceptedFileTypes = [
    '.json',
    '.yaml',
    '.yml',
    '.wsdl',
    'application/json',
    'application/yaml',
    'application/x-yaml',
    'text/xml',
    'application/xml'
  ];

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-6 transition-colors duration-200
        ${dragActive
      ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
      : 'border-gray-200 dark:border-gray-700'}`}
    >
      <div className="flex flex-col items-center justify-center">
        <IconFileImport size={28} className="text-gray-400 dark:text-gray-500 mb-3" />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
          accept={acceptedFileTypes.join(',')}
        />
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          Drop file to import or{' '}
          <button className="text-blue-500 underline cursor-pointer" onClick={handleBrowseFiles}>
            choose a file
          </button>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Supports Bruno, Postman, Insomnia, OpenAPI v3, and WSDL formats
        </p>
      </div>
    </div>
  );
};

export default FileTab;
