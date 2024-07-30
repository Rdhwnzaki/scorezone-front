import React, { useEffect, useMemo, useState, Fragment, useCallback } from 'react'
import Sidebar from '../../components/Sidebar'
import { useDispatch, useSelector } from 'react-redux';

import {
    getClub as onGetClubs,
    addNewClub as onAddNewClub,
    updateClub as onUpdateClub,
    deleteClub as onDeleteClub,
    getClubLoading,
    resetClubState,
} from "../../store/club/action";
import { isEmpty } from 'lodash';
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
import { RiDeleteBin2Line, RiPencilLine } from 'react-icons/ri';
import Header from '../../components/Header';
import {
    Row, Col, Button, Input, Modal, ModalHeader, Form, ModalBody, Label, FormFeedback, Spinner
} from 'reactstrap';
import { useFormik } from "formik";
import * as Yup from "yup";
import Footer from '../../components/Footer';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from '../../components/DeleteModal';

function Club() {

    const {
        clubs,
        isClubCreated,
        loading,
    } = useSelector((state) => ({
        clubs: state.Club.clubs,
        isClubCreated: state.Club.isClubCreated,
        isClubSuccess: state.Club.isClubSuccess,
        loading: state.Club.loading,
        error: state.Club.error,
    }));

    const dispatch = useDispatch()
    const [pIndex, setPIndex] = useState(0);
    const [isLoad, setIsLoad] = useState(false)
    const [clubList, setClubList] = useState([])
    const [club, setClub] = useState([])
    const [isEdit, setIsEdit] = useState(false);
    const [modal, setModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    const toggle = useCallback(() => {
        if (modal) {
            setModal(false);
            setClub(null);
            setIsEdit(false)
        } else {
            setModal(true);
        }
    }, [modal]);

    const handleDeleteClub = () => {
        if (club) {
            dispatch(onDeleteClub(club));
            setDeleteModal(false);
        }
    };

    const onClickDelete = useCallback((club) => {
        setClub(club);
        setDeleteModal(true);
    }, []);

    const handleClubClick = useCallback((data) => {
        setClub({
            id: data.id,
            name: data.name,
            city: data.city
        })
        toggle()
    }, [toggle])

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: (club && club.name) || "",
            city: (club && club.city) || "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Please Enter Name"),
            city: Yup.string().required("Please Enter City"),
        }),
        onSubmit: (values) => {
            dispatch(getClubLoading());
            if (isEdit) {
                const editClub = {
                    id: club ? club.id : 0,
                    name: values.name,
                    city: values.city,
                };
                dispatch(onUpdateClub(editClub));
                validation.resetForm();
            } else {
                const newClub = {
                    name: values.name,
                    city: values.city,
                };
                dispatch(onAddNewClub(newClub));
                validation.resetForm();
            }
            toggle();
        },
    });

    const columns = useMemo(
        () => [
            {
                Header: "Action",
                filterable: false,
                Cell: (cellProps) => {
                    return (
                        <div className='hstack gap-2 mt-4 mt-sm-0'>
                            <button
                                className='btn btn-primary btn-sm'
                                onClick={() => {
                                    const clubData = cellProps.row.original;
                                    handleClubClick(clubData);
                                    setIsEdit(true)
                                }}>
                                <RiPencilLine className="fs-16" />
                            </button>
                            <button
                                className='btn btn-danger btn-sm'
                                onClick={() => {
                                    const club = cellProps.row.original;
                                    onClickDelete(club);
                                }}>
                                <RiDeleteBin2Line className='fs-16' />
                            </button>
                        </div>
                    );
                },
            },
            {
                Header: `Name`,
                accessor: "name",
                filterable: true,
            },
            {
                Header: `City`,
                accessor: "city",
                filterable: true,
            },
        ],
        [handleClubClick, onClickDelete]
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
            setIsLoad(true)
        }
    }, [isLoad, dispatch])

    useEffect(() => {
        if (isClubCreated) {
            dispatch(resetClubState())
            dispatch(onGetClubs())
        }
    }, [isClubCreated, dispatch])

    useEffect(() => {
        if (!isEmpty(clubs)) {
            setClubList(clubs)
        }
    }, [clubs])

    useEffect(() => {
        setPIndex(pageIndex);
    }, [pageIndex]);

    return (
        <div id="layoutSidenav">
            <Sidebar />
            <div id="layoutSidenav_content">
                <Header title={"ScoreZone"} pageTitle={'Club'} />
                <div className='card border-1'>
                    <div className='card-body'>
                        <div className='d-flex'>
                            <div className='flex-grow-1 p-2'>
                                <h5>Club Data</h5>
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
                            <div className='p-2'>
                                <button className='btn btn-success' onClick={() => { toggle() }}>Add Club</button>
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
            <Modal
                id='showModal'
                isOpen={modal}
                centered
                fullscreen={false}
                size='md'>
                <ModalHeader className='bg-light p-3' toggle={toggle}>
                    {!!isEdit
                        ? 'Edit Club'
                        : 'Add Club'}
                </ModalHeader>
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                    }}>
                    <ModalBody>
                        <Row>
                            <Col lg={12}>
                                <div className='mb-3'>
                                    <Label htmlFor='name-field' className='form-label'>
                                        Name <span className='text-danger'>*</span>
                                    </Label>
                                    <Input
                                        name='name'
                                        id='name-field'
                                        className='form-control'
                                        placeholder='Enter Name'
                                        type='text'
                                        validate={{ required: { value: true } }}
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.name || ""}
                                        invalid={
                                            validation.touched.name &&
                                                validation.errors.name
                                                ? true
                                                : false
                                        }
                                    />
                                    {validation.touched.name &&
                                        validation.errors.name ? (
                                        <FormFeedback type='invalid'>
                                            {validation.errors.name}
                                        </FormFeedback>
                                    ) : null}
                                </div>
                                <div className='mb-3'>
                                    <Label htmlFor='city-field' className='form-label'>
                                        City <span className='text-danger'>*</span>
                                    </Label>
                                    <Input
                                        name='city'
                                        id='city-field'
                                        className='form-control'
                                        placeholder='Enter City'
                                        type='text'
                                        validate={{ required: { value: true } }}
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.city || ""}
                                        invalid={
                                            validation.touched.city &&
                                                validation.errors.city
                                                ? true
                                                : false
                                        }
                                    />
                                    {validation.touched.city &&
                                        validation.errors.city ? (
                                        <FormFeedback type='invalid'>
                                            {validation.errors.city}
                                        </FormFeedback>
                                    ) : null}
                                </div>
                            </Col>
                        </Row>
                    </ModalBody>
                    <div className='modal-footer mb3'>
                        <div className='hstack gap-2 justify-content-end'>
                            <button
                                type='button'
                                className='btn btn-light'
                                onClick={() => {
                                    setModal(false);
                                    validation.resetForm();
                                }}>
                                Cancel
                            </button>
                            <button type='submit' className='btn btn-success'>
                                <span className='d-flex align-items-center'>
                                    <span className='flex-grow-1 me-2'>
                                        {!!isEdit
                                            ? 'Update Club'
                                            : 'Add Club'}
                                    </span>
                                    {loading ? (
                                        <Spinner
                                            size='sm'
                                            className='flex-shrink-0'
                                            role='status'>
                                            Loading...
                                        </Spinner>
                                    ) : (
                                        ""
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>
                </Form>
            </Modal>
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDeleteClub}
                onCloseClick={() => setDeleteModal(false)}
            />
            <ToastContainer closeButton={false} />
        </div>
    )
}

export default Club