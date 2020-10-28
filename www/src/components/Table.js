import React, { useState, useEffect } from "react";
import { useTable, useFilters, useSortBy, usePagination, useGlobalFilter, useAsyncDebounce } from "react-table";
import axios from 'axios';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import Pagination from '@material-ui/lab/Pagination';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import Switch from '@material-ui/core/Switch';
import LinearProgress from '@material-ui/core/LinearProgress';

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span
      style={{
        // paddingLeft: '30px',
        fontWeight: 'bold'
      }}
    >
      SEARCH :{' '}
      <input
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          width: '280px',
          fontSize: '1.1rem',
          border: '0',
        }}
      />
    </span>
  );
}

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter, id },
}) {
  const count = preFilteredRows.length;
  console.log(filterValue);
  console.log(id);
  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`${count} records...`}
      style={{
        width: "100px",
      }}
    />
  );
}


export default function Table({
  fetchData,
  filterEmptyData,
  columns,
  data,
  loading,
  saveDataHandling,
  exportDataHandling,
  saveButtonDisable,
  importButtonDisable,
  importDataHandling,

  pageIndexVal,
  setPageIndexVal,

  pageSizeVal,
  setPageSizeVal,

  globalFilterVal,
  setGlobalFilterVal,

  emptyList,
  setEmptyList
}) {



  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
    preGlobalFilteredRows
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: pageIndexVal,
        pageSize: pageSizeVal,
        globalFilter: globalFilterVal
      },
      defaultColumn,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    setPageIndexVal(pageIndex);
  }, [pageIndex]);

  useEffect(() => {
    setPageSizeVal(pageSize);
  }, [pageSize]);

  useEffect(() => {
    setGlobalFilterVal(globalFilter);
  }, [globalFilter]);

  // Render the UI for your table
  return (
    <>
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2
          )}
        </code>
      </pre> */}

      <div
        style={{
          width: '100%',

          backgroundColor: 'lightGray',
          position: 'fixed',
          zIndex: '1',
          bottom: '0px',
          left: '0px'
        }}
        className="pagination">


        <div
          style={{
            minWidth: '1000px'
          }}
        >
          <Button
            variant="contained"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            style={{
              width: '20px',
              height: '30px',
            }}
          >
            {'<<'}
          </Button>{' '}
          <Button
            variant="contained"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            style={{
              width: '20px',
              height: '30px',
            }}
          >
            {'<'}
          </Button>{' '}

          <Button
            variant="contained"
            onClick={() => nextPage()}
            disabled={!canNextPage}
            style={{
              width: '20px',
              height: '30px',
            }}
          >
            {'>'}
          </Button>{' '}

          <Button
            variant="contained"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            style={{
              width: '20px',
              height: '30px',
            }}
          >
            {'>>'}
          </Button>{' '}

          <Button
            style={{
              backgroundColor: 'yellow',
              width: '20px',
              marginLeft: '30px',
              height: '30px',
            }}
            onClick={() => {
              setPageSize(1);
              nextPage();
              filterEmptyData();
            }} disabled={!canNextPage}>
            {'>1'}
          </Button>

          {/* <Switch
            checked={emptyList}
            onChange={e => {
              setEmptyList(e.target.checked);
              filterEmptyData(e.target.checked);
            }}
            name="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          /> */}

          <span
            style={{
              marginLeft: '30px',
            }}
          >
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>

          <span>
            | Go to page:{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: '50px' }}
            />
          </span>{' '}

          <select
            style={{
              width: '100px',
              height: '30px',

            }}
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            minWidth: '1000px'
          }}
        >
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />

          <Button
            variant="contained"
            onClick={() => saveDataHandling()}
            disabled={saveButtonDisable}
            style={{
              width: '100px',
              height: '30px',
              backgroundColor: (saveButtonDisable == false) ? 'green' : 'gray',
              color: 'white',
              fontWeight: 'bold',
              marginLeft: '30px',
              zIndex: '1',
            }}
          >SAVE</Button>

          <Button
            variant="contained"
            onClick={() => exportDataHandling()}
            style={{
              width: '100px',
              height: '30px',
              backgroundColor: 'blue',
              color: 'white',
              fontWeight: 'bold',
              marginLeft: '30px',
              zIndex: '1',
            }}
          >EXPORT</Button>

          <Button
            variant="contained"
            component="label"
            disabled={importButtonDisable}
            style={{
              width: '100px',
              height: '30px',
              backgroundColor: (importButtonDisable == false) ? 'orangered' : 'gray',
              color: 'white',
              fontWeight: 'bold',
              marginLeft: '30px',
              zIndex: '1',
            }}>
            IMPORT
            <input
              style={{
                display: 'none',
              }}
              id="upload-button"
              name="file"
              type="file"
              multiple
              onChange={importDataHandling.bind(this)}
            />
          </Button>
        </div>
      </div>
      <h2
        style={{
          margin: '0px',
          padding: '0px',
          marginBottom: '10px',
          textAlign: 'center',
        }}
      >
        VN HUMAN RESOURCE DATA TOOLS
      </h2>

      {
        loading ? <LinearProgress /> : null
      }
      <table
        style={{
          marginBottom: '100px',
        }}
        {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  // {...column.getHeaderProps(column.getSortByToggleProps())}  //temporarily disable
                  className={
                    column.isSorted
                      ? column.isSortedDesc
                        ? "sort-desc"
                        : "sort-asc"
                      : ""
                  }
                >
                  {column.render("Header")}
                  <hr />
                  {/* <div>{column.canFilter ? column.render('Filter') : null}</div> //temporarily disable */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td
                      {...cell.getCellProps()}
                    >{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>

      </table>

    </>
  );
}
