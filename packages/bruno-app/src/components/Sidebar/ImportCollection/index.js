import React, { useState } from 'react';
import { toastError } from 'utils/common/error';
import Modal from 'components/Modal';
import { convertOpenapiToBruno } from 'utils/importers/openapi-collection';
import ImportSettings from 'components/Sidebar/ImportSettings';
import FullscreenLoader from './FullscreenLoader/index';
import ImportCollectionTabs from 'components/Sidebar/ImportCollection/ImportCollectionTabs';

const ImportCollection = ({ onClose, handleSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showImportSettings, setShowImportSettings] = useState(false);
  const [openApiData, setOpenApiData] = useState(null);
  const [groupingType, setGroupingType] = useState('tags');

  const handleImportSettings = () => {
    try {
      const collection = convertOpenapiToBruno(openApiData, { groupBy: groupingType });
      handleSubmit({ collection });
    } catch (err) {
      console.error(err);
      toastError(err, 'Failed to process OpenAPI specification');
    }
  };

  if (isLoading) {
    return <FullscreenLoader isLoading={isLoading} />;
  }

  if (showImportSettings) {
    return (
      <ImportSettings
        groupingType={groupingType}
        setGroupingType={setGroupingType}
        onClose={onClose}
        onConfirm={handleImportSettings}
      />
    );
  }

  return (
    <Modal size="md" title="Import Collection" hideFooter={true} handleCancel={onClose} dataTestId="import-collection-modal">
      <div className="flex flex-col">
        <div className="mb-4">
          <ImportCollectionTabs
            setShowImportSettings={setShowImportSettings}
            setOpenApiData={setOpenApiData}
            setIsLoading={setIsLoading}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ImportCollection;
