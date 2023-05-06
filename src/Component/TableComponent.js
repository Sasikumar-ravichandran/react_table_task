import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap'
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux'
import { getBeerList } from '../store/action';
import 'bootstrap/dist/css/bootstrap.css';
import Pagination from 'react-bootstrap/Pagination';
import "./tableComponent.css"
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import { OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';

const TableComponent = () => {
    const store = useSelector(state => state.beerList)
    const [isLoading, setIsLoading] = useState(store.spinnerLoad);
    const dispatch = useDispatch()
    const [beerListData, setBeerListData] = useState(null)
    const [page, setPage] = useState(1);
    const pageCount = 10;
    const [tableKeys, setTableKeys] = useState(null)
    const [dateValue, setDateValue] = useState(null)
    const [dateType, setdateType] = useState({ value: null, label: 'All' })

    const arrayOfdateFilter = [{ value: null, label: 'All' }, { value: 'brewed_before', label: 'Before' }, { value: 'brewed_after', label: 'After' }]


    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#f1f1f1',
            borderColor: 'darkgray',
        }),
        menu: (provided, state) => ({
            ...provided,
            backgroundColor: 'lightgray',
        }),
        option: (provided, state) => ({
            ...provided,
            color: '#333',
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: '#333',
        })
    };


    const onDateSelectionChange = (e) => {
        setdateType(e)
        if (e.label === 'All') {
            setDateValue(null)
        }
    }

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const selectedMonth = selectedDate.getMonth();
        const selectedYear = selectedDate.getFullYear();
        setDateValue(`${dateType.value}=${selectedMonth}-${selectedYear}`)
    }


    useEffect(() => {
        setIsLoading(true)
        dispatch(
            getBeerList({
                dateFilter: dateValue,
                pageNum: page
            })
        )
    }, [page, dateValue, dateType])


    useEffect(() => {
        setIsLoading(store.spinnerLoad)
        setBeerListData(store.allData)
        setTableKeys(Object.keys(store?.allData && store?.allData.length > 0 && store?.allData[0]))
    }, [store])


    const tableHeader = (headerItem) => {

        if (headerItem === "first_brewed") {
            return (
                <th >
                    <Row style={{ width: '280px' }}>
                        <Col xs="6">
                            {headerItem}
                        </Col>
                        <Col xs="6" style={{ textAlign: 'end' }}>
                            <Select
                                size="sm"
                                isClearable={false}
                                options={arrayOfdateFilter}
                                styles={customStyles}
                                value={dateType}
                                onChange={(e) => onDateSelectionChange(e)}
                            />
                        </Col >
                    </Row>
                    {dateType && dateType.label !== "All" ? <Row>
                        <Col style={{ marginTop: '5px' }}>
                            <input type='date' onChange={(e) => handleDateChange(e)}></input>
                        </Col>
                    </Row> : null}
                </th>
            )
        } else {
            return (
                <th >
                    {headerItem}
                </th>
            )
        }


    }


    const tableData = (item, keyVal) => {

        let returnText

        if (keyVal.includes('volume')) {
            returnText = item[keyVal]["value"] + '-' + item[keyVal]["unit"]
        } else if (keyVal.includes('food_pairing')) {

            returnText = item[keyVal].toString()

        } else if (keyVal === "method") {
            let text = []
            {
                Object.keys(item[keyVal]).map((ele) => {
                    if (ele === "fermentation") {
                        text.push(
                            ele + ' :- ' + item[keyVal][ele]["temp"]["value"] + '-' + item[keyVal][ele]["temp"]["unit"]
                        )
                    } else if (ele === "mash_temp") {
                        item[keyVal][ele] && item[keyVal][ele].map((ele1, idx) => {
                            if (item[keyVal][ele][idx]["duration"] !== null) {
                                text.push(
                                    ele + ' :- ' + item[keyVal][ele][idx]["duration"] + 'mins, ' + item[keyVal][ele][idx]["temp"]["value"] + '-' + item[keyVal][ele][idx]["temp"]["unit"]
                                )

                            } else {
                                text.push(
                                    ele + ' :- ' + item[keyVal][ele][idx]["temp"]["value"] + '-' + item[keyVal][ele][idx]["temp"]["unit"]
                                )

                            }
                        })
                    } else if (ele === "twist") {
                        text.push(
                            ele + ' :- ' + item[keyVal][ele]
                        )
                    }
                })
            }
            returnText = text.join(', ')
        } else if (keyVal === "ingredients") {

            let finalText = []

            Object.keys(item[keyVal]).map((ele) => {

                let finalObject = []

                if (ele === "hops") {
                    let objItem = []
                    item[keyVal][ele].map((ele1) => {
                        let hopsText = []
                        Object.keys(ele1).map((ele2) => {
                            if (ele2 == "amount") {
                                hopsText.push(ele1[ele2]["value"] + '-' + ele1[ele2]["unit"])
                            } else {
                                hopsText.push(ele1[ele2])
                            }
                        })
                        objItem.push(
                            hopsText.join(' ')
                        )
                    })
                    finalObject.push(ele + ' :- ' + objItem.join(', '))
                } else if ("malt") {
                    let maltObj = []
                    if (Array.isArray(item[keyVal][ele])) {
                        item[keyVal][ele].map((ele1) => {
                            let maltText = []
                            Object.keys(ele1).map((ele2) => {
                                if (ele2 == "amount") {
                                    maltText.push(ele1[ele2]["value"] + '-' + ele1[ele2]["unit"])
                                } else {
                                    maltText.push(ele1[ele2])
                                }
                            })
                            maltObj.push(
                                maltText.join(' ')
                            )
                        })
                        finalObject.push(ele + ' :- ' + maltObj.join(', '))
                    } else {
                        finalObject.push(ele + ' :- ' + item[keyVal][ele])
                    }

                } else {
                    finalObject.push(ele + ' :- ' + item[keyVal][ele])
                }
                finalText.push(finalObject.join())

            })
            returnText = finalText.join(' | ')

        }
        else {
            returnText = item[keyVal] && item[keyVal].toString()

        }

        return (
            <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>{returnText}</Tooltip>}
            >
                <td className="text-nowrap text-truncate" style={{ maxWidth: '200px' }}>
                    {returnText}
                </td>
            </OverlayTrigger>

        )

    }

    return (
        <>
            <Card style={{ background: 'lightgray' }}>
                <CardHeader style={{ background: 'darkgray' }}>
                    <h4> Beer List </h4>
                </CardHeader>
                <CardBody>
                    <div className="table-container" style={{ width: '100%', overflowX: 'scroll' }}>
                        <Table striped bordered hover style={{ tableLayout: 'auto' }}>
                            <thead>
                                <tr>
                                    {tableKeys && tableKeys.map((item) => {
                                        return (
                                            <>{tableHeader(item)}</>
                                        )
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr className="text-center">
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>

                                    </tr>
                                ) : 
                                    beerListData && beerListData.map((item) => {
                                        return (
                                            <tr key={item.id}>
                                                {
                                                    tableKeys.map((keyVal) => {
                                                        return (
                                                            <>{tableData(item, keyVal)}</>
                                                        )
                                                    })
                                                }
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </Table>
                    </div>
                </CardBody>
                <div style={{ justifyContent: 'center', display: 'flex', padding: '10px' }}>
                    <Pagination >
                        <Pagination.Prev
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        />
                        {Array.from({ length: pageCount }, (_, i) => (
                            <Pagination.Item
                                key={i}
                                active={i + 1 === page}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => setPage(page + 1)}
                            disabled={page === pageCount}
                        />
                    </Pagination>
                </div>

            </Card>
        </>
    )
}

export default TableComponent
