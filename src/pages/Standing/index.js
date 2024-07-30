import React, { useEffect, useMemo, useState, Fragment } from 'react'
import Sidebar from '../../components/Sidebar'
import { useDispatch, useSelector } from 'react-redux';

import {
    getClub as onGetClubs,
    resetClubState,
} from "../../store/club/action";
import {
    getScore as onGetScores,
    resetScoreState,
} from "../../store/score/action";
import {
    useTable,
    useGlobalFilter,
    useAsyncDebounce,
    useSortBy,
    useFilters,
    useExpanded,
    usePagination,
    useRowSelect,
} from "react-table";

import { Table } from 'reactstrap';
import Header from '../../components/Header';
import {
    Row, Col, Button, Input, Spinner
} from 'reactstrap';
import Footer from '../../components/Footer';
import "react-toastify/dist/ReactToastify.css";

function Standing() {

    const {
        clubs,
        loading,
        scores
    } = useSelector((state) => ({
        clubs: state.Club.clubs,
        loading: state.Club.loading,
        scores: state.Score.scores
    }));

    const dispatch = useDispatch()
    const [pIndex, setPIndex] = useState(0);
    const [isLoad, setIsLoad] = useState(false)
    const [clubList, setClubList] = useState([])

    const columns = useMemo(
        () => [
            {
                Header: `Name`,
                accessor: "name",
                filterable: true,
            },
            {
                Header: `MA`,
                filterable: true,
                Cell: (standing) => (
                    <>
                        <h6 className='fw-normal'>{`${standing.row.original.ma.length}`}</h6>
                    </>
                ),
            },
            {
                Header: `ME`,
                filterable: true,
                Cell: (standing) => (
                    <>
                        <h6 className='fw-normal'>{`${standing.row.original.me}`}</h6>
                    </>
                ),
            },
            {
                Header: `S`,
                filterable: true,
                Cell: (standing) => (
                    <>
                        <h6 className='fw-normal'>{`${standing.row.original.s}`}</h6>
                    </>
                ),
            },
            {
                Header: `K`,
                filterable: true,
                Cell: (standing) => (
                    <>
                        <h6 className='fw-normal'>{`${standing.row.original.k}`}</h6>
                    </>
                ),
            },
            {
                Header: `GM`,
                filterable: true,
                Cell: (standing) => (
                    <>
                        <h6 className='fw-normal'>{`${standing.row.original.gm}`}</h6>
                    </>
                ),
            },
            {
                Header: `GK`,
                filterable: true,
                Cell: (standing) => (
                    <>
                        <h6 className='fw-normal'>{`${standing.row.original.gk}`}</h6>
                    </>
                ),
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        preGlobalFilteredRows,
        setGlobalFilter,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns: columns,
            data: clubList,
            defaultColumn: { Filter: null },
            initialState: {
                pageIndex: pIndex,
                pageSize: 10,
                selectedRowIds: 0,
                sortBy: [
                    {
                        desc: true,
                    },
                ],
            },
        },
        useGlobalFilter,
        useFilters,
        useSortBy,
        useExpanded,
        usePagination,
        useRowSelect
    );

    const onChangeInSelect = (event) => {
        setPageSize(Number(event.target.value));
    };

    const onChangeInInput = (event) => {
        const page = event.target.value ? Number(event.target.value) - 1 : 0;
        gotoPage(page);
    };

    const count = preGlobalFilteredRows.length;
    const [searchValue, setSearchValue] = useState([]);
    const onChange = useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 200);

    const generateFilterable = (column) => {
        return column.filterable
            ? column.isSorted
                ? column.isSortedDesc
                    ? " sorting_desc"
                    : " sorting_asc"
                : " sort"
            : "";
    };

    const generateSortingIndicator = (column) => {
        return column.isSorted ? (column.isSortedDesc ? " " : "") : "";
    };



    useEffect(() => {
        if (!isLoad) {
            dispatch(resetClubState())
            dispatch(onGetClubs())
            dispatch(resetScoreState())
            dispatch(onGetScores())
            setIsLoad(true)
        }
    }, [isLoad, dispatch])

    useEffect(() => {
        setPIndex(pageIndex);
    }, [pageIndex]);

    useEffect(() => {
        if (scores.length > 0 && clubs.length > 0) {
            scores.forEach((sc) => {
                clubs.forEach((cl) => {
                    console.log(sc);
                    if (cl.id === sc.clubId1 || cl.id === sc.clubId2) {
                        if (!cl.ma) {
                            cl.ma = [];
                        }
                        cl.ma = cl.ma.concat(sc.id);
                        cl.ma = [...new Set(cl.ma)];
                    }

                    if (cl.id === sc.clubId1) {
                        if (!cl.me) {
                            cl.me = 0
                        }
                        if (sc.score1 > sc.score2) {
                            cl.me++
                        }
                    } else if (cl.id === sc.clubId2) {
                        if (!cl.me) {
                            cl.me = 0
                        }
                        if (sc.score2 > sc.score1) {
                            cl.me++
                        }
                    }

                    if (cl.id === sc.clubId1) {
                        if (!cl.s) {
                            cl.s = 0
                        }
                        if (sc.score1 === sc.score2) {
                            cl.s++
                        }
                    } else if (cl.id === sc.clubId2) {
                        if (!cl.s) {
                            cl.s = 0
                        }
                        if (sc.score2 === sc.score1) {
                            cl.s++
                        }
                    }

                    if (cl.id === sc.clubId1) {
                        if (!cl.k) {
                            cl.k = 0
                        }
                        if (sc.score1 < sc.score2) {
                            cl.k++
                        }
                    } else if (cl.id === sc.clubId2) {
                        if (!cl.k) {
                            cl.k = 0
                        }
                        if (sc.score2 < sc.score1) {
                            cl.k++
                        }
                    }

                    if (cl.id === sc.clubId1) {
                        if (!cl.gm) {
                            cl.gm = 0
                        }
                        if (sc.score1) {
                            cl.gm = cl.gm + sc.score1
                        }
                    } else if (cl.id === sc.clubId2) {
                        if (!cl.gm) {
                            cl.gm = 0
                        }
                        if (sc.score2) {
                            cl.gm = cl.gm + sc.score2
                        }
                    }

                    if (cl.id === sc.clubId1) {
                        if (!cl.gk) {
                            cl.gk = 0
                        }
                        if (sc.score2) {
                            cl.gk = cl.gk + sc.score2
                        }
                    } else if (cl.id === sc.clubId2) {
                        if (!cl.gk) {
                            cl.gk = 0
                        }
                        if (sc.score1) {
                            cl.gk = cl.gk + sc.score1
                        }
                    }

                })
            })
            setClubList(clubs)
        }
    }, [clubs, scores])

    useEffect(() => {
        if (clubs) {
            console.log(clubs);
        }
    }, [clubs])

    return (
        <div id="layoutSidenav">
            <Sidebar />
            <div id="layoutSidenav_content">
                <Header title={"ScoreZone"} pageTitle={'Standing'} />
                <div className='card border-1'>
                    <div className='card-body'>
                        <div className='d-flex'>
                            <div className='flex-grow-1 p-2'>
                                <h5>Standings</h5>
                                {loading ? (
                                    <>
                                        <Spinner color='primary' type='grow' size={"sm"}>
                                            Loading...
                                        </Spinner>
                                        &nbsp;
                                        <Spinner color='success' type='grow' size={"sm"}>
                                            Loading...
                                        </Spinner>
                                        &nbsp;
                                    </>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                        <Row className='mb-3'>
                            <form>
                                <Row>
                                    <Col sm={1} className='col-xxl-1'>
                                        <div className='me-2 mb-2 col-12'>
                                            <select
                                                className='form-select'
                                                value={pageSize}
                                                onChange={onChangeInSelect}>
                                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                                    <option key={pageSize} value={pageSize}>
                                                        {pageSize}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <div className='search-box me-2 mb-2 d-inline-block col-12'>
                                            <input
                                                onChange={(e) => {
                                                    setSearchValue(e.target.value);
                                                    onChange(e.target.value);
                                                }}
                                                id='search-bar-0'
                                                type='text'
                                                className='form-control search'
                                                placeholder={`${count} ${"Search"}...`}
                                                value={searchValue || ""}
                                            />
                                            <i className='bx bx-search-alt search-icon'></i>
                                        </div>
                                    </Col>
                                </Row>
                            </form>
                        </Row>
                        <div className='table-responsive table-card'>
                            <Table
                                hover
                                {...getTableProps()}
                                className='align-middle table-nowrap'>
                                <thead className='table-light text-muted'>
                                    {headerGroups.map((headerGroup) => (
                                        <tr
                                            className={""}
                                            key={headerGroup.id}
                                            {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column) => (
                                                <th
                                                    key={column.id}
                                                    className={"" + generateFilterable(column)}
                                                    {...column.getSortByToggleProps()}>
                                                    {column.render("Header")}
                                                    {generateSortingIndicator(column)}
                                                    {/* <Filter column={column} /> */}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>

                                <tbody {...getTableBodyProps()}>
                                    {page.map((row) => {
                                        prepareRow(row);
                                        return (
                                            <Fragment key={row.getRowProps().key}>
                                                <tr>
                                                    {row.cells.map((cell) => {
                                                        return (
                                                            <td key={cell.id} {...cell.getCellProps()}>
                                                                {cell.render("Cell")}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            </Fragment>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                        <Row className='justify-content-md-end justify-content-center align-items-center p-2'>
                            <Col className='col-md-auto'>
                                <div className='d-flex gap-1'>
                                    <Button
                                        color='light'
                                        onClick={previousPage}
                                        disabled={!canPreviousPage}>
                                        {"<"}
                                    </Button>
                                </div>
                            </Col>
                            <Col className='col-md-auto d-none d-md-block'>
                                {`${"Page"} `}
                                <strong>
                                    {pageIndex + 1} of {pageOptions.length}
                                </strong>
                            </Col>
                            <Col className='col-md-auto'>
                                <Input
                                    type='number'
                                    min={1}
                                    style={{ width: 70 }}
                                    max={pageOptions.length}
                                    value={pIndex + 1}
                                    onChange={onChangeInInput}
                                />
                            </Col>

                            <Col className='col-md-auto'>
                                <div className='d-flex gap-1'>
                                    <Button
                                        className='btn btn-light'
                                        onClick={nextPage}
                                        disabled={!canNextPage}>
                                        {">"}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Standing