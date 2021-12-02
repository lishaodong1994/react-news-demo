import './index.scss'
import React ,{useEffect,useState} from 'react'
import { withRouter } from 'react-router';
import { Layout,Menu } from 'antd'
import axios from 'axios'
import {
    UserOutlined,
  } from '@ant-design/icons';
const {Sider } =Layout;
const { SubMenu } = Menu;



// const menuList =[
//   {
//     key:'/home',
//     title:'首页',
//     icon:<UserOutlined />
//   },
//   {
//     key:'/user-manage',
//     title:'用户管理',
//     icon:<UserOutlined />,
//     children:[
//       {
//         key:'/user-manage/list',
//         title:'用户列表',
//         icon:<UserOutlined />
//       }
//     ]
//   },
//   {
//     key:'/right-manage',
//     title:'权限管理',
//     icon:<UserOutlined />,
//     children:[
//       {
//         key:'/right-manage/role/list',
//         title:'角色列表',
//         icon:<UserOutlined />
//       },
//       {
//         key:'/right-manage/right/list',
//         title:'权限列表',
//         icon:<UserOutlined />
//       }
//     ]
//   }
// ]
const iconList= {
  '/home':<UserOutlined />,
  '/user-manage':<UserOutlined />,
  '/user-manage/list':<UserOutlined />,
  '/right-manage':<UserOutlined />,
  '/right-manage/role/list':<UserOutlined />,
  '/right-manage/right/list':<UserOutlined />,
  '/news-manage':<UserOutlined />,
  '/news-manage/add':<UserOutlined />,
  '/news-manage/draft':<UserOutlined />,
  '/news-manage/category':<UserOutlined />,
  '/audit-manage':<UserOutlined />,
  '/audit-manage/audit':<UserOutlined />,
  '/audit-manage/list':<UserOutlined />,
  '/publish-manage':<UserOutlined />,
  '/publish-manage/unpublished':<UserOutlined />,
  '/publish-manage/published':<UserOutlined />,
  '/publish-manage/sunset':<UserOutlined />,
}

function SideMemu(props) {
  const [menu, setMenu] = useState([])
    useEffect(() => {
     axios.get('http://localhost:5050/rights?_embed=children')
     .then(res=>{
       console.log(res.data);
       setMenu(res.data)
      })
    }, [])
    const checkPagePermission=(item)=>{
      return item.pagepermisson===1
    }
    const renderMenu =(i)=>{
     return i.map(item=>{
       if(item.children?.length>0 && checkPagePermission(item)){
         return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                  {renderMenu(item.children)}
                </SubMenu>
       }else{
         return checkPagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={()=>{props.history.push(item.key)}}>{item.title}</Menu.Item>
       }
     })
    }
    const openKey ='/'+props.location.pathname.split('/')[1]
    return (
          <Sider trigger={null} collapsible collapsed={false}>
            <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
              <div className="logo" >新闻发布系统</div>
              <Menu theme="dark" mode="inline" defaultOpenKeys={[openKey]} selectedKeys={[props.location.pathname]} style={{flex:1,overflow:'auto'}}>
                {/* <Menu.Item key="1" icon={<UserOutlined />}>首页</Menu.Item>
                <Menu.Item key="2" icon={<VideoCameraOutlined />}>nav 2</Menu.Item>
                <SubMenu key="sub4" icon={<SettingOutlined />} title="Navigation Three">
                  <Menu.Item key="9">Option 9</Menu.Item>
                  <Menu.Item key="10">Option 10</Menu.Item>
                  <Menu.Item key="11">Option 11</Menu.Item>
                  <Menu.Item key="12">Option 12</Menu.Item>
                </SubMenu>   */}
                {renderMenu(menu)}
              </Menu>
            </div>
          </Sider>   
    )
}
export default  withRouter(SideMemu)