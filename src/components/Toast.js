import Alert from 'react-bootstrap/Alert';

function SimpleToast(props) {
    if (props.alertShow) {
        return (
            <>
                <Alert variant="danger">
                    <div class="d-flex">
                        <div class="flex-grow-1">
                            <Alert.Heading>{props.alertTitle}</Alert.Heading>
                        </div>
                        <div class="alert-close-style" onClick={() => props.setAlertShow(false)}>close</div>
                    </div>
                    <p>
                        {props.alertContent}
                    </p>
                </Alert>
            </>
        );
    }
    return <></>
}

export default SimpleToast;