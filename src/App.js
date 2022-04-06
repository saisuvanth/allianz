import {useState,useEffect} from 'react';
import {Container,Row,Col,Button,Modal,Alert} from 'react-bootstrap';
import styles from './assets/css/components.module.css';


function App() {
  const [data1,setData1]=useState([{name:'A',number:1},{name:'B',number:2},{name:'C',number:3},{name:'D',number:4},{name:'E',number:5}]);
  const [data2,setData2]=useState(['+','-','*','/','','>','<','=']);
  const [data3,setData3]=useState([]);
  const [show, setShow] = useState(false);
  const [alertShow, setAlertShow] = useState({alert:false,alertType:'danger',message:''});
  const [rhsValue, setRhsValue] = useState(0);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(()=>{
    fetch('http://localhost:3001').then(res=>res.json()).then(json=>{
      setData1(json);
      console.log(data1);
    });
  },[]);

  function onDragStart(e,index,type){
    e.dataTransfer.setData("id", index);
    e.dataTransfer.setData("type", type);
  }

  function onDragOver(e){
    e.preventDefault();
  }

  function onDrop(e){
    e.preventDefault();
    let id=e.dataTransfer.getData('id');
    let type=e.dataTransfer.getData('type');
    setData3(prev=>[...prev,type==='1'?data1[id]:data2[id]]);
  }

  function closeButton(index){
    setData3(prev=>prev.filter((item,i)=>i!==index));
  }

  function validate(){
    let result=0;
    let num1=parseInt(data3[0].number);
    let num2=parseInt(data3[2].number);
    let operator=data3[1];
    console.log(data3);
    switch(operator){
      case '+':
        result=num1+num2;
        break;
      case '-':
        result=num1-num2;
        break;
      case '*':
        result=num1*num2;
        break;
      case '/':
        result=num1/num2;
        break;
      default:
        result=0;
    }
    console.log(result);
    console.log(rhsValue);
    if(data3[3]==='>'){
      if(result>parseInt(rhsValue)){
        setAlertShow({alert:true,alertType:'success',message:'Correct'});
      }else{
        setAlertShow({alert:true,alertType:'danger',message:'Incorrect'});
      }
    }else if(data3[3]==='<'){
      if(result<parseInt(rhsValue)){
        setAlertShow({alert:true,alertType:'success',message:'Correct'});
      }else{
        setAlertShow({alert:true,alertType:'danger',message:'Incorrect'});
      }
    }else if(data3[3]==='='){
      if(result===parseInt(rhsValue)){
        setAlertShow({alert:true,alertType:'success',message:'Correct'});
      }else{
        setAlertShow({alert:true,alertType:'danger',message:'Incorrect'});
      }
    }
  }

  return (
    <>
    <div className={styles.main}>
      <Container>
        <Row className={styles.dragcontainer}>
          {data1?.map((item,index)=>
            <Col className={styles.columns} draggable onDragStart={e=>onDragStart(e,index,1)} key={index}>{item.name}</Col>
          )}
        </Row>
      </Container>
      <Container>
        <Row className={styles.dragcontainer}>
          {data2?.map((item,index)=>
            <Col className={item===''?'':styles.columns} draggable onDragStart={e=>onDragStart(e,index,2)} key={index}>{item}</Col>
          )}
        </Row>
      </Container>
      <Container className='d-flex w-100 pb-3'>
        <Row className={styles.dropcontainer+' w-100'} onDragOver={(e)=>onDragOver(e)} onDrop={e=>onDrop(e)}>
          {data3?.map((item,index)=>
            <Col className={styles.columns1} key={index}>
              <span className={styles.pull_right} data-effect="fadeOut" onClick={()=>closeButton(index)}><i className="fa fa-times"></i></span>
              <p>{item.name?item.name:item}</p>
              </Col>
          )}
          <Button className={styles.columns1} style={{alignItems:'center',justifyContent:'center'}} variant='primary' onClick={handleShow}>{rhsValue?rhsValue:'RHS'}</Button>
        </Row>
      </Container>
      <Alert show={alertShow.alert} variant={alertShow.alertType}>
        <Alert.Heading>Result</Alert.Heading>
        <p>
          {alertShow.message}
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setAlertShow({alert:false,alertType:'danger',message:''})} variant={"outline-"+alertShow.alertType}>
            Close
          </Button>
        </div>
      </Alert>
      <Container className='pt-5 d-flex justify-content-center'>
        <Button variant='primary' onClick={validate}>VALIDATE</Button>
      </Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Value</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="number" name="validate" id="validate" value={rhsValue} onChange={(e)=>setRhsValue(e.currentTarget.value) }/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
}

export default App;
