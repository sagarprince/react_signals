import styles from './Filters.module.scss';
import useApp from '../../hooks/useApp';
import React, { Fragment, useCallback, useMemo } from 'react';
import { ReadonlySignal, Signal } from '@preact/signals-react';
import { classNames } from '../../utils';

interface Filter {
    key: string;
    label: string;
    count: ReadonlySignal<number>;
}

export const Filters: React.FC = () => {
    const {
        allTodosCount,
        activeTodosCount,
        completedTodosCount,
        currentFilter,
        handleFilterChange
    } = useApp();

    console.log('Render Filters ');

    const filters: Filter[] = useMemo(() => {
        return [
            {
                key: 'all',
                label: 'All',
                count: allTodosCount
            },
            {
                key: 'active',
                label: 'Active',
                count: activeTodosCount
            },
            {
                key: 'completed',
                label: 'Completed',
                count: completedTodosCount
            },
        ];
    }, []);

    const handleChange = useCallback((filter: any) => {
        handleFilterChange(filter.key);
    }, []);

    return (
        <div className={classNames('tabs tabs-boxed', styles.filters)}>
            <FiltersTabs
                currentFilter={currentFilter}
                filters={filters}
                handleChange={handleChange} />
        </div>
    );
}

const FiltersTabs: React.FC<{
    filters: Filter[],
    currentFilter: Signal<string>,
    handleChange: (filter: any) => void
}> = ({ filters, currentFilter, handleChange }) => {

    return (
        <>
            {filters.map((filter: any) => {
                return (
                    <Fragment key={filter.key}>
                        <a className={`tab ${(currentFilter.value == filter.key ? ' tab-active' : '')}`} onClick={(e) => {
                            e.preventDefault();
                            handleChange(filter);
                        }}>{filter.label} ({filter.count})</a>
                    </Fragment>
                )
            })}
        </>
    );
}