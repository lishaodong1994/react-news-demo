import React, { useState, useEffect } from 'react'
import { Table, Button, Tag, Modal,Popover,Switch } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

export default function RightList() {
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get('http://localhost:5050/rights?_embed=children')
      .then(res => {
        const list = res.data
        list.forEach(item => {
          if (item.children.length === 0) {
            item.children = ''
          }
        })
        setDataSource(list)
      })
  }, [])

  const showConfirm = (item) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: '删除后将无法撤回，您确认要删除吗?',
      cancelText: '取消',
      okText: '确定',
      onOk() {
        if (item.grade === 1) {
          //console.log('grade:1,一级删除，前端删除，后端同步删除', item);
          setDataSource(dataSource.filter(data => data.id !== item.id))
          axios.delete(`http://localhost:5050/rights/${item.id}`)
        } else {
          //console.log('grade:2,二级删除，前端删除，后端同步删除', item);
          let list = dataSource.filter(data => data.id === item.rightId);
          list[0].children = list[0].children.filter(data => data.id !== item.id)
          //filter是做到一层深复制（浅拷贝)，children还是原来那个children，这里直接去改了children地址值里面的内容。
          //REACT无法检测多层，判定没有变化，实际上children内容已经变化了，所以[...dataSource]重新定义一下才行
          //console.log(list, dataSource);
          setDataSource([...dataSource])
          axios.delete(`http://localhost:5050/children/${item.id}`)
        }
      },
    });
  }
  const onChange= (item)=> {
    item.pagepermisson=item.pagepermisson===1?0:1
    setDataSource([...dataSource])
    if(item.grade===1){
      axios.patch(`http://localhost:5050/rights/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }else{
      axios.patch(`http://localhost:5050/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (i) => {
        return <b>{i}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      align: 'center',
      render: (k) => {
        return <Tag color="cyan">{k}</Tag>
      }
    },
    {
      title: '操作',
      width: '180px',
      align: 'center',
      render: (item) => {
        return <div>
          <Button  
          onClick={() => { showConfirm(item) }} 
          type="primary" danger shape="circle" 
          icon={<DeleteOutlined />} 
          style={{ marginRight: '10px' }}/>
          <Popover 
          overlayStyle={{width:'100px'}} 
          content={<Switch checked={item.pagepermisson?true:false} onChange={()=>{onChange(item)}} />} 
          title="页面配置项" 
          trigger={item.pagepermisson===undefined||item.key==='/right-manage/right/list'?'':'click'}>
            <Button 
            type="primary" 
            shape="circle" 
            icon={<EditOutlined />} 
            disabled={item.pagepermisson===undefined||item.key==='/right-manage/right/list'} />
          </Popover>
        </div>
      }
    },
  ];


  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{
        pageSize: 5
      }} />;
    </div>
  )
}
