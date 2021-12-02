import React from 'react'
import { Table, Button, Modal,Tree } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react'
import axios from 'axios'
const { confirm } = Modal



export default function RoleList() {
    const [dataSource, setdataSource] = useState([])
    const [rightList, setrightList] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);//树形权限弹出框状态
    const [currentRights, setcurrentRights] = useState([])  //存当前点击项的right
    const [currentId, setcurrentId] = useState(0)   //存当前点击项的i d


    //请求数据：（用于表头渲染和树形结构 权限checkbox
    useEffect(() => {
        axios.get('http://localhost:5050/roles').then(res => {
            setdataSource(res.data)
        })
    }, [])
    //table表格
    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            render: id => <b>{id}</b>,
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '操作',
            width: '180px',
            align: 'center',
            render: (item) => {
                return <div>
                    <Button type="primary" danger shape="circle" icon={<DeleteOutlined />}
                        style={{ marginRight: '10px' }} onClick={() => showConfirm(item)} />
                    <Button type="primary" shape="circle" icon={<EditOutlined />} 
                    onClick={()=>{ showModal(item)}} 
                    />
                </div>
            }
        },
    ]
    // 点击删除按钮 弹出confirm弹出框，进行删除逻辑
    const showConfirm = (item) => {
        confirm({
            title: '警告',
            icon: <ExclamationCircleOutlined />,
            content: '删除后将无法撤回，您确认要删除吗?',
            cancelText: '取消', 
            okText: '确定',
            onOk() {
                setdataSource(dataSource.filter(data => data.id !== item.id))
                axios.delete(`http://localhost:5050/roles/${item.id}`)
            },
        });
    }

    //树形弹出框状态 ：可见。 //获取保存当前点击项的rights 和 id
    const showModal = (item) => {
        setIsModalVisible(true); 
        setcurrentRights(item.rights)
        setcurrentId(item.id)
    };
    
    //请求数据：（用于Tree树形结构列表渲染
    useEffect(() => {
        axios.get('http://localhost:5050/rights?_embed=children').then(res => {
            setrightList(res.data)
        })
    }, [])
   
   //点击Tree里的checkbox重新改变currentRights 使 Tree受控
    const onCheck = (checkedKeys) => {
        setcurrentRights(checkedKeys.checked)
    };


    //含tree的弹出框确定和取消逻辑:
    const handleOk = () => {
        setIsModalVisible(false);//弹出框状态不显示
        //改前端渲染数据
        setdataSource(dataSource.map(item=>{
            if(item.id===currentId){
                return{...item,rights:currentRights}
            }else{
                return item
            }
        }))
        axios.patch(`http://localhost:5050/roles/${currentId}`,{
            rights:currentRights
        })

    };
    const handleCancel = () => {
        setIsModalVisible(false);//弹出框状态不显示
    };

    return (
        <div>
            {/* 表格 */}
            <Table dataSource={dataSource} columns={columns} rowKey={item=> item.id}></Table>
            {/* 弹出框 */}
            <Modal cancelText="取消" okText="确定" title="角色权限分配" 
            visible={isModalVisible} //是否显示：树形弹出框状态
            onOk={handleOk} 
            onCancel={handleCancel}>
                <Tree
                    checkable
                    treeData={rightList} 
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    checkStrictly={true} //使tree父子不关联
                />
            </Modal>
        </div>
    )
}
