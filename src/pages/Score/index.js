import React, { useEffect, useMemo, useState, Fragment, useCallback } from 'react'
import Sidebar from '../../components/Sidebar'
import { useDispatch, useSelector } from 'react-redux';

import {
    getScore as onGetScores,
    addNewScore as onAddNewScore,
    updateScore as onUpdateScore,
    deleteScore as onDeleteScore,
    getScoreLoading,
    resetScoreState,
} from "../../store/score/action";
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
import Select from "react-select"
import { getClub, resetClubState } from '../../store/actions';

function Score() {

    const {
        scores,
        isScoreCreated,
        loading,
        clubs,
    } = useSelector((state) => ({
        scores: state.Score.scores,
        isScoreCreated: state.Score.isScoreCreated,
        isScoreSuccess: state.Score.isScoreSuccess,
        loading: state.Score.loading,
        error: state.Score.error,
        clubs: state.Club.clubs,
    }));

    const dispatch = useDispatch()
    const [pIndex, setPIndex] = useState(0);
    const [isLoad, setIsLoad] = useState(false)
    const [scoreList, setScoreList] = useState([])
    const [score, setScore] = useState([])
    const [isEdit, setIsEdit] = useState(false);
    const [modal, setModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [inputArr, setInputArr] = useState([])
    const [clubList, setClubList] = useState([])
    const [isMultiple, setIsMultiple] = useState(false)
    const [clubSelect, setClubSelect] = useState([])

    const toggle = useCallback(() => {
        if (modal) {
            setModal(false);
            setScore(null);
            setIsEdit(false)
            setIsMultiple(false)
            setInputArr([])
        } else {
            setModal(true);
        }
    }, [modal]);

    const handleDeleteScore = () => {
        if (score) {
            dispatch(onDeleteScore(score));
            setDeleteModal(false);
        }
    };

    const onClickDelete = useCallback((score) => {
        setScore(score);
        setDeleteModal(true);
    }, []);

    const handleScoreClick = useCallback((data) => {
        let datas = []
        datas.push({ club: { label: data.club1.name, value: data.club1.id }, score: data.score1 }, { club: { label: data.club2.name, value: data.club2.id }, score: data.score2 })

        setIsMultiple(data.isMultiple)
        setInputArr([...inputArr, { club: { label: data.club1.name, value: data.club1.id }, score: data.score1 }, { club: { label: data.club2.name, value: data.club2.id }, score: data.score2 }])
        setScore({
            id: data.id,
            datas: datas
        })
        toggle()
    }, [toggle, inputArr])

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            data: (score && score.data) || [],
        },
        validationSchema: Yup.object({
            // club1: Yup.number().required("Please Enter Club"),
            // club2: Yup.number().required("Please Enter Club"),
            // score1: Yup.string().required("Please Enter Score"),
            // score2: Yup.string().required("Please Enter Score"),
        }),
        onSubmit: (values) => {
            dispatch(getScoreLoading());
            if (isEdit) {
                let clubId = []
                let scores = []
                inputArr.forEach((item => {
                    clubId.push(item.club.value)
                    scores.push(item.score)
                }))
                const updateScore = {
                    id: score.id,
                    datas: { club: clubId, score: scores },
                    isMultiple: false
                };
                dispatch(onUpdateScore(updateScore));
                validation.resetForm();
            } else {
                if (!isMultiple) {
                    let clubId = []
                    let score = []
                    inputArr.forEach((item => {
                        clubId.push(item.club.value)
                        score.push(item.score)
                    }))
                    const newScore = {
                        datas: { club: clubId, score: score },
                        isMultiple: false
                    };
                    dispatch(onAddNewScore(newScore));
                    validation.resetForm();
                } else {
                    const newScore = {
                        datas: inputArr,
                        isMultiple: true
                    };
                    dispatch(onAddNewScore(newScore));
                    validation.resetForm();
                }
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
                                    const scoreData = cellProps.row.original;
                                    handleScoreClick(scoreData);
                                    setIsEdit(true)
                                }}>
                                <RiPencilLine className="fs-16" />
                            </button>
                            <button
                                className='btn btn-danger btn-sm'
                                onClick={() => {
                                    const score = cellProps.row.original;
                                    onClickDelete(score);
                                }}>
                                <RiDeleteBin2Line className='fs-16' />
                            </button>
                        </div>
                    );
                },
            },
            {
                Header: `Club`,
                filterable: true,
                Cell: (score) => (
                    <>
                        <h6 className='fw-normal'>{`${score.row.original.club1 ? score.row.original.club1.name : "-"} vs ${score.row.original.club2 ? score.row.original.club2.name : "-"}`}</h6>
                    </>
                ),
            },
            {
                Header: `Score`,
                filterable: true,
                Cell: (score) => (
                    <>
                        <h6 className='fw-normal'>{`${score.row.original.score1} - ${score.row.original.score2}`}</h6>
                    </>
                ),
            },
        ],
        [handleScoreClick, onClickDelete]
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
            data: scoreList,
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
            dispatch(resetScoreState())
            dispatch(onGetScores())
            dispatch(resetClubState())
            dispatch(getClub())
            setIsLoad(true)
        }
    }, [isLoad, dispatch])

    useEffect(() => {
        if (isScoreCreated) {
            dispatch(resetScoreState())
            dispatch(onGetScores())
        }
    }, [isScoreCreated, dispatch])

    useEffect(() => {
        if (scores) {
            setScoreList(scores)
        }
    }, [scores])

    useEffect(() => {
        setPIndex(pageIndex);
    }, [pageIndex]);

    useEffect(() => {
        if (!isEmpty(clubs)) {
            var data = [];
            var opt = [];
            clubs.forEach((item, key) => {
                const name = item.name;
                const id = item.id;
                var obj = { label: name, value: id };
                opt.push(obj);
            });
            var option = { options: opt };
            data.push(option);
            setClubList(data);
        }
    }, [clubs]);

    const getClubOption = useMemo(() => {
        if (clubList || clubSelect) {
            const val = clubList[0]?.options.filter((itm) => {
                return clubSelect.indexOf(itm.label) === -1;
            });
            console.log(val);
            return val;
        }
    }, [clubList, clubSelect]);

    const handleAdd = () => {
        if (!isMultiple) {
            setInputArr([...inputArr, { club: "", score: "" }, { club: "", score: "" }])
        } else {
            setInputArr([...inputArr, { club1: "", score1: "", club2: "", score2: "" }])
        }
    }

    return (
        <div id="layoutSidenav">
            <Sidebar />
            <div id="layoutSidenav_content">
                <Header title={"ScoreZone"} pageTitle={'Score'} />
                <div className='card border-1'>
                    <div className='card-body'>
                        <div className='d-flex'>
                            <div className='flex-grow-1 p-2'>
                                <h5>Score Data</h5>
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
                                <button className='btn btn-success' onClick={() => {
                                    toggle()
                                    setIsMultiple(true)
                                }}>Add Score Multiple</button>
                            </div>
                            <div className='p-2'>
                                <button className='btn btn-success' onClick={() => {
                                    toggle()
                                    handleAdd()
                                }}>Add Score</button>
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
                size={!isMultiple ? "md" : "lg"}>
                <ModalHeader className='bg-light p-3' toggle={toggle}>
                    {!!isEdit
                        ? 'Edit Score'
                        : 'Add Score'}
                </ModalHeader>
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                    }}>
                    <ModalBody>
                        {!isMultiple ? (
                            <Row>
                                {inputArr.map((item, idx) => {
                                    return (
                                        <Fragment key={"item-" + idx}>
                                            <Col lg={6}>
                                                <div className='mb-3'>
                                                    <Label htmlFor='name-field' className='form-label'>
                                                        Club <span className='text-danger'>*</span>
                                                    </Label>
                                                    <Select
                                                        name={`datas.${idx}.club`}
                                                        value={inputArr[idx].club}
                                                        aria-invalid={validation.touched.club}
                                                        aria-errormessage={validation.errors.club}
                                                        placeholder="Select Club"
                                                        onChange={(e) => {
                                                            validation.setFieldValue(
                                                                `datas.${idx}.club`, e
                                                            );
                                                            inputArr[idx].club = e
                                                            let fc = []
                                                            fc.push(e.label)
                                                            setClubSelect(fc)
                                                        }}
                                                        options={getClubOption}></Select>
                                                    {validation.touched.club && (
                                                        <p role="alert" style={{ color: '#f06548', fontSize: "11px" }}>
                                                            {validation.errors.club}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className='mb-3'>
                                                    <Label htmlFor='score-field' className='form-label'>
                                                        Score <span className='text-danger'>*</span>
                                                    </Label>
                                                    <Input
                                                        name={`datas.${idx}.score`}
                                                        id='score-field'
                                                        className='form-control'
                                                        placeholder='Enter Score'
                                                        type='number'
                                                        validate={{ required: { value: true } }}
                                                        onChange={(e) => {
                                                            validation.setFieldValue(
                                                                `datas.${idx}.score`, e.target.value
                                                            );
                                                            inputArr[idx].score = e.target.value
                                                        }}
                                                        onBlur={validation.handleBlur}
                                                        value={inputArr[idx].score}
                                                        invalid={
                                                            validation.touched.score &&
                                                                validation.errors.score
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.score &&
                                                        validation.errors.score ? (
                                                        <FormFeedback type='invalid'>
                                                            {validation.errors.score}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>
                                        </Fragment>
                                    )
                                })}
                            </Row>
                        ) : (
                            <Fragment>
                                <div className='d-flex justify-content-end'>
                                    <div className='btn btn-success' onClick={() => {
                                        handleAdd()
                                    }}>Add</div>
                                </div>
                                <div style={{ overflow: "scroll", height: "250px" }}>
                                    {inputArr.map((item, itemIdx) => {
                                        return (
                                            <div key={'itemIdx-' + itemIdx} className='row'>
                                                <div className='mb-3 col-3'>
                                                    <Label htmlFor='name-field' className='form-label'>
                                                        Club <span className='text-danger'>*</span>
                                                    </Label>
                                                    <Select
                                                        name={`datas.${itemIdx}.club1`}
                                                        value={inputArr[itemIdx].club1}
                                                        aria-invalid={validation.touched.club}
                                                        aria-errormessage={validation.errors.club}
                                                        placeholder="Select Club"
                                                        onChange={(e) => {
                                                            validation.setFieldValue(
                                                                `datas.${itemIdx}.club1`, e
                                                            );
                                                            inputArr[itemIdx].club1 = e
                                                            let fc = []
                                                            fc.push(e.label)
                                                            setClubSelect(fc)
                                                        }}
                                                        options={getClubOption}></Select>
                                                </div>
                                                <div className='mb-3 col-3'>
                                                    <Label htmlFor='name-field' className='form-label'>
                                                        Club <span className='text-danger'>*</span>
                                                    </Label>
                                                    <Select
                                                        name={`datas.${itemIdx}.club2`}
                                                        value={inputArr[itemIdx].club2}
                                                        aria-invalid={validation.touched.club}
                                                        aria-errormessage={validation.errors.club}
                                                        placeholder="Select Club"
                                                        onChange={(e) => {
                                                            validation.setFieldValue(
                                                                `datas.${itemIdx}.club2`, e
                                                            );
                                                            inputArr[itemIdx].club2 = e
                                                            let fc = []
                                                            fc.push(e.label)
                                                            setClubSelect(fc)
                                                        }}
                                                        options={getClubOption}></Select>
                                                </div>
                                                <div className='mb-3 col-3'>
                                                    <Label htmlFor='score-field' className='form-label'>
                                                        Score <span className='text-danger'>*</span>
                                                    </Label>
                                                    <Input
                                                        name={`datas.${itemIdx}.score1`}
                                                        id='score-field'
                                                        className='form-control'
                                                        placeholder='Enter Score'
                                                        type='number'
                                                        validate={{ required: { value: true } }}
                                                        onChange={(e) => {
                                                            validation.setFieldValue(
                                                                `datas.${itemIdx}.score1`, e.target.value
                                                            );
                                                            inputArr[itemIdx].score1 = e.target.value
                                                        }}
                                                        onBlur={validation.handleBlur}
                                                        value={inputArr[itemIdx].score1}
                                                        invalid={
                                                            validation.touched.score &&
                                                                validation.errors.score
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                </div>
                                                <div className='mb-3 col-3'>
                                                    <Label htmlFor='score-field' className='form-label'>
                                                        Score <span className='text-danger'>*</span>
                                                    </Label>
                                                    <Input
                                                        name={`datas.${itemIdx}.score2`}
                                                        id='score-field'
                                                        className='form-control'
                                                        placeholder='Enter Score'
                                                        type='number'
                                                        validate={{ required: { value: true } }}
                                                        onChange={(e) => {
                                                            validation.setFieldValue(
                                                                `datas.${itemIdx}.score2`, e.target.value
                                                            );
                                                            inputArr[itemIdx].score2 = e.target.value
                                                        }}
                                                        onBlur={validation.handleBlur}
                                                        value={inputArr[itemIdx].score2}
                                                        invalid={
                                                            validation.touched.score &&
                                                                validation.errors.score
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Fragment>
                        )}
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
                                            ? 'Update Score'
                                            : 'Add Score'}
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
                onDeleteClick={handleDeleteScore}
                onCloseClick={() => setDeleteModal(false)}
            />
            <ToastContainer closeButton={false} />
        </div>
    )
}

export default Score