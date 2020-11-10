import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PageviewIcon from '@material-ui/icons/Pageview';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Table from "../components/Table";
import "./App.css";
import CONFIG from "../configs";

const Genres = ({ values }) => {
    return (
        <>
            {values.map((genre, idx) => {
                return (
                    <span key={idx} className="badge">
                        {genre}
                    </span>
                );
            })}
        </>
    );
};

function Main() {

    const [selectedFile, setSelectedFile] = React.useState(null);
    const [loaded, setLoaded] = React.useState(0);
    const [dialogState, setDialogState] = React.useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [header, setHeader] = useState([]);
    const [updateData, setUpdateData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [updatedItems, setUpdatedItems] = useState([]);
    const [saveButtonDisable, setSaveButtonDisable] = useState(false);
    const [importButtonDisable, setImportButtonDisable] = useState(false);
    const [openMessage, setOpenMessage] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const [infoMessage, setInfoMessage] = useState(false);
    const [pageIndexVal, setPageIndexVal] = useState(0);
    const [pageSizeVal, setPageSizeVal] = useState(10);
    const [globalFilterVal, setGlobalFilterVal] = useState('');
    const [emptyList, setEmptyList] = useState(false);

    const EditableCell = ({
        value: initialValue,
        row: { index },
        column: { id }
    }) => {
        // We need to keep and update the state of the cell normally
        const [value, setValue] = React.useState(initialValue);

        const onChange = e => {
            setValue(e.target.value);
        };

        // We'll only update the external data when the input is blurred
        const onBlur = () => {

            setData(old =>
                old.map((row, ind) => {
                    if (ind === index) {
                        setUpdatedItems(updatedItems => [...updatedItems, index]);
                        return {
                            ...old[index],
                            [id]: value || null,
                        };
                    }
                    return row;
                })
            );
        };

        // If the initialValue is changed external, sync it up with our state
        React.useEffect(() => {
            setValue(initialValue);
        }, [initialValue]);

        return <input

            value={value}
            onChange={onChange}
            onBlur={onBlur}
            style={
                (id == 'candidateEmail') ?
                    {
                        width: '250px',
                        fontSize: '16px',
                    } : {
                        width: '150px',
                        fontSize: '16px',
                    }}
        />;
    };

    const saveDataHandling = () => {
        setDialogState(true);
        let tempData = [];
        const updatedItemsUnique = Array.from(new Set(updatedItems));
        updatedItemsUnique.forEach(item => {
            if ((originalData[item]['candidatePhone'] != data[item]['candidatePhone']) || (originalData[item]['candidateEmail'] != data[item]['candidateEmail'])) {
                tempData.push({
                    'source': 'MyWork',
                    'candidateUrl': data[item]['candidateUrl'],
                    'candidateName': data[item]['candidateName'],
                    'candidateEmailOld': originalData[item]['candidateEmail'],
                    'candidateEmail': data[item]['candidateEmail'],

                    'candidatePhoneOld': originalData[item]['candidatePhone'],
                    'candidatePhone': data[item]['candidatePhone'],
                });
            }
        });
        setUpdateData(tempData);
    };

    const exportDataHandling = () => {
        const fileName = 'data.xlsx';
        console.log(data);
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'test');

        XLSX.writeFile(wb, fileName);
    };


    const checkMimeType = (event) => {
        let files = event.target.files;
        let err = [];
        const types = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

        for (var x = 0; x < files.length; x++) {
            console.log(files[x].type);
            if (types.every(type => files[x].type !== type)) {
                err[x] = files[x].type + ' is not a supported format\n';
            }
        };
        for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
            // toast.error(err[z]);
            event.target.value = null;
        }
        return true;
    };

    const maxSelectFile = (event) => {
        let files = event.target.files;
        if (files.length > 10) {
            const msg = 'Only 10 images can be uploaded at a time';
            event.target.value = null;
            // toast.warn(msg);
            return false;
        }
        return true;
    };

    const checkFileSize = (event) => {
        let files = event.target.files;
        let size = 2000000;
        let err = [];
        for (var x = 0; x < files.length; x++) {
            if (files[x].size > size) {
                err[x] = files[x].type + 'is too large, please pick a smaller file\n';
            }
        };

        for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
            // discard selected file
            // toast.error(err[z]);
            event.target.value = null;
        }
        return true;
    };

    function importDataHandling(event) {
        setImportButtonDisable(true);
        let files = event.target.files;
        if (maxSelectFile(event) && checkMimeType(event) && checkFileSize(event)) {
            setLoaded(0);
            let bodyFormData = new FormData();

            for (let x = 0; x < files.length; x++) {
                bodyFormData.append(`file${x}`, files[x]);
            }

            axios.post(`${CONFIG.serverUrl}/api/mywork/upload`, bodyFormData, {
                onUploadProgress: ProgressEvent => {
                    setLoaded(ProgressEvent.loaded / ProgressEvent.total * 100);
                },
            })
                .then(res => { // then print response status
                    console.log('import success');
                })
                .catch(err => {
                    console.log('import fail');
                });
        }
    };

    const handleSave = async () => {
        setSaveButtonDisable(true);
        setDialogState(false);
        console.log(`${CONFIG.serverUrl}/api/mywork/update`);
        console.log(updateData);
        const result = await axios({
            method: 'post',
            url: `${CONFIG.serverUrl}/api/mywork/update`,
            headers: {},
            data: updateData
        });

        if (result.status == 200) {
            fetchData();
            setUpdatedItems([]);
            setUpdateData([]);
        }
    };

    const handleClose = () => {
        setDialogState(false);
    };

    const fetchData = () => {
        (async () => {
            console.log('FETCH DATA...');
            setLoading(true);
            const result = await axios(`${CONFIG.serverUrl}/api/mywork/list`);
            if (result.status == 200) {
                setLoading(false);

                let headers = [];

                for (var key in result.data[0]) {
                    if (!result.data[0].hasOwnProperty(key)) continue;
                    if (key.includes('candidate') && headers.length < 20) {
                        let header = {
                            Header: key.replace('candidate', ''),
                            accessor: key,
                        };
                        switch (key) {
                            case 'candidateUrl':
                                header.Cell = ({ cell: { value } }) =>
                                    <a href={value} target="_blank"

                                    >
                                        <PageviewIcon
                                            style={{
                                                marginTop: '0px',
                                                fontSize: '40pt'
                                            }}
                                        />
                                    </a>;
                                break;

                            case 'candidateAvatar':
                                header.Cell = ({ cell: { value } }) => {
                                    return ((value !== null) ? <img src={value} target="_blank" width="50" height="50" /> : '');
                                };
                                break;

                            case 'candidateEmail':
                            case 'candidatePhone':
                                header.Cell = EditableCell;
                                break;

                            case 'candidateEducationLength':
                                header.Header = 'Edu';
                                break;

                            case 'candidateExperienceLength':
                                header.Header = 'Exp';
                                break;

                            case 'candidateYearsOfExpNum':
                                header.Header = 'ExpNum';
                                break;

                            default:
                                break;
                        }
                        headers.push(header);
                    }
                }
                // console.log(result.data[0]);
                setHeader(headers);
                setData(result.data);
                setOriginalData(result.data);
            }

        })();
    };

    const filterEmptyData = () => {
        if (!emptyList) {
            setEmptyList(true);

            let filterData = data.filter(item => (!item.candidateEmail || !item.candidatePhone));

            setData(filterData);
            setOriginalData(filterData);
        }
    };

    const updateStatus = () => {
        setInterval((async () => {
            let response = await axios.get(`${CONFIG.serverUrl}/api/mywork/status`);
            let data = response.data;
            if (data) {
                let now = new Date();
                now.setSeconds(now.getSeconds() - 3);

                if (data['MyworkImportStatus'] && (new Date(data['MyworkImportStatus'].updated) > now)) {
                    setImportButtonDisable(true);
                    setInfoMessage(data['MyworkImportStatus'].message);
                    setOpenInfo(true);
                } else if (data['MyworkSaveStatus'] && (new Date(data['MyworkSaveStatus'].updated) > now)) {
                    setSaveButtonDisable(true);
                    setInfoMessage(data['MyworkSaveStatus'].message);
                    setOpenInfo(true);
                } else {
                    setSaveButtonDisable(false);
                    setImportButtonDisable(false);
                    setInfoMessage(null);
                    setOpenInfo(false);
                }
            }

        }), 1000);
    };

    useEffect(() => {
        fetchData();
        updateStatus();
    }, []);

    return (

        <div className="App">

            <Collapse
                style={{
                    width: '40%',
                    textAlign: 'center',
                    zIndex: '1',
                    position: 'fixed',
                    margin: '0% 30%'
                }}
                in={openMessage}>
                <Alert

                    variant="filled" severity="success"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpenMessage(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    Updated successfully!
        </Alert>
            </Collapse>

            <Collapse
                style={{
                    width: '30%',
                    textAlign: 'center',
                    zIndex: '1',
                    position: 'fixed',
                    margin: '0% 35%'
                }}
                in={openInfo}>

                <Alert
                    variant="filled" severity="info"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {infoMessage}
                </Alert>
            </Collapse>

            <Table

                fetchData={fetchData}
                filterEmptyData={filterEmptyData}
                columns={header}
                data={data}
                loading={loading}
                saveDataHandling={saveDataHandling}
                exportDataHandling={exportDataHandling}
                saveButtonDisable={saveButtonDisable}
                importButtonDisable={importButtonDisable}
                importDataHandling={importDataHandling}

                pageIndexVal={pageIndexVal}
                setPageIndexVal={setPageIndexVal}

                pageSizeVal={pageSizeVal}
                setPageSizeVal={setPageSizeVal}

                globalFilterVal={globalFilterVal}
                setGlobalFilterVal={setGlobalFilterVal}

                emptyList={emptyList}
                setEmptyList={setEmptyList}
            />

            <Dialog
                open={dialogState}
                maxWidth={false}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{
                    updateData.length ?
                        "Did you change these fields?" : null
                }</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {
                            updateData.length ?
                                <table
                                    style={{
                                        fontWeight: 'lighter',
                                        color: 'gray'
                                    }}
                                ><tr>
                                        <th>Name</th>
                                        <th>OldEmail</th>
                                        <th>NewEmail</th>
                                        <th>OldPhone</th>
                                        <th>NewPhone</th>
                                    </tr>
                                    {
                                        updateData.map((data) => {
                                            return <tr>
                                                <td
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: 'black'
                                                    }}
                                                >{data['candidateName']}</td>

                                                {
                                                    (data['candidateEmailOld'] != data['candidateEmail']) ?
                                                        <>
                                                            <td>{data['candidateEmailOld']}</td>
                                                            <td
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'green',
                                                                }}
                                                            >
                                                                {data['candidateEmail']}
                                                            </td>
                                                        </> :
                                                        <>
                                                            <td></td>
                                                            <td></td>
                                                        </>
                                                }

                                                {
                                                    (data['candidatePhoneOld'] != data['candidatePhone']) ?
                                                        <>
                                                            <td>{data['candidatePhoneOld']}</td>
                                                            <td
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'green',
                                                                }}
                                                            >
                                                                {data['candidatePhone']}
                                                            </td>
                                                        </> :
                                                        <>
                                                            <td></td>
                                                            <td></td>
                                                        </>
                                                }
                                            </tr>;
                                        })
                                    }

                                </table>
                                : 'Nothing was changed!'
                        }


                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Close
          </Button>
                    {
                        updateData.length ?
                            <Button onClick={handleSave} color="primary">
                                Save
          </Button> : null
                    }
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default Main;
