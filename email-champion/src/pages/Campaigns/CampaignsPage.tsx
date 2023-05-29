import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from '../../shared/hooks/useDocumentTitle';
import { useCampaigns, useCampaignsDispatch } from '../../shared/hooks/useCampaigns';
import { SET_CURRENT_PAGE, SET_QUERY } from '../../shared/contexts/ContactsContext';

import styles from './CampaignsPage.module.scss';

import { ROUTES } from '../../constants';

import { DataTable, TableColumn } from '../../shared/components/DataTable/DataTable';
import Pagination from '../../shared/components/Pagination/Pagination';
import { Button, Input } from '../../shared/components/Form';

export default function CampaignsPage() {
  useDocumentTitle('Campaigns');
  const { campaigns = [], totalCount, currentPage, isLoading, query, error, deleteCampaign = () => {} } = useCampaigns();
  const dispatch = useCampaignsDispatch();
  const navigate = useNavigate();

  const onEdit = useCallback((contact: any) => {
    navigate(ROUTES.EDIT_CAMPAIGN.replace(':id', contact.id));
  }, []);

  const onDelete = useCallback(
    (campaign: any) => {
      if (confirm('Do you want to delete this campaign?')) {
        deleteCampaign(campaign.id);
      }
    },
    [campaigns, currentPage]
  );

  const columns: TableColumn[] = [
    { label: 'Campaign Name', key: 'name' },
    { label: 'Subject', key: 'subject' },
    { label: 'Recipients', key: 'recipients' },
    { label: 'Status', key: 'status' },
    {
      label: 'Actions',
      key: 'actions',
      component: (data) => {
        return <CampaignActions onEdit={() => onEdit(data)} onDelete={() => onDelete(data)} />;
      },
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header__heading}>
          <h1>Campaigns</h1>
          <h3>List of all the campaigns created and sent.</h3>
        </div>
        <div className={styles.header__actions}>
          <Button type='button' onClick={() => navigate(ROUTES.ADD_CAMPAIGN)}>
            New Campaign
          </Button>
        </div>
      </div>
      <div className={styles.wrap}>
        <SearchCampaignsInput
          value={query}
          setValue={(value: any) => {
            dispatch({ type: SET_QUERY, query: value });
          }}
        />
        <div className={styles.campaigns_table}>
          <DataTable columns={columns} rows={campaigns} noResultsMessage='No Campaigns Found...' isLoading={isLoading} />

          <div className={styles.campaigns_pagination}>
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={10}
              onPageChange={(page) => {
                dispatch({ type: SET_CURRENT_PAGE, currentPage: page });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CampaignActions({ onEdit, onDelete }: any) {
  return (
    <div className={styles.campaign_actions}>
      <button type='button' onClick={onEdit} title='Edit Campaign'>
        <i className='fa fa-edit' aria-hidden='true'></i>
      </button>
      <button type='button' onClick={onDelete} title='Delete Campaign'>
        <i className='fa fa-trash' aria-hidden='true'></i>
      </button>
    </div>
  );
}

function SearchCampaignsInput({ value, setValue }: any) {
  const inputRef = useRef();

  const handleChange = () => {
    const input: any = inputRef && inputRef.current;
    setValue(input.value || '');
  };

  return (
    <div className={styles.search_campaigns_input}>
      <Input ref={inputRef} type='text' name='search' placeholder='Search...' value={value} onChange={handleChange} autoComplete='off' />
    </div>
  );
}
