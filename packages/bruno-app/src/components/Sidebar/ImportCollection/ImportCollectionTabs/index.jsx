import classnames from 'classnames';
import React, { useState } from 'react';
import { IconBrandGit, IconFileImport } from '@tabler/icons';
import FileTab from 'components/Sidebar/ImportCollection/ImportCollectionTabs/FileTab';
import StyledWrapper from 'components/Sidebar/ImportCollection/StyledWrapper';
import GitTab from 'components/Sidebar/ImportCollection/ImportCollectionTabs/GitTab';

const ImportCollectionTabs = ({ setIsLoading, setShowImportSettings, setOpenApiData, handleSubmit }) => {
  const [tab, setTab] = useState('file');

  const getTabPanel = (tab) => {
    switch (tab) {
      case 'file': {
        return (
          <FileTab
            setIsLoading={setIsLoading}
            setShowImportSettings={setShowImportSettings}
            setOpenApiData={setOpenApiData}
            handleSubmit={handleSubmit}
          />
        );
      }
      case 'git': {
        return <GitTab />;
      }
    }
  };

  const getTabClassname = (tabName) => {
    return classnames(`flex gap-1 items-center tab select-none ${tabName}`, {
      active: tabName === tab
    });
  };

  return (
    <StyledWrapper className="flex flex-col h-full relative px-4 py-4 overflow-hidden">
      <div className="flex flex-wrap items-center tabs" role="tablist">
        <div className={getTabClassname('file')} role="tab" onClick={() => setTab('file')}>
          <IconFileImport size={16} /> Files
        </div>
        <div className={getTabClassname('git')} role="tab" onClick={() => setTab('git')}>
          <IconBrandGit size={16} /> Git Repository
        </div>
      </div>
      <section className="mt-4 h-full overflow-auto">{getTabPanel(tab)}</section>
    </StyledWrapper>
  );
};

export default ImportCollectionTabs;
