import React from 'react'
import {Button} from 'antd'
import axios from 'axios'

export default function Home() {
    const ajax =()=>{
        axios.get('http://localhost:8000/posts/2')
        .then(res=>{console.log(res.data);})
    }
    const ajax2 =()=>{
        axios.post('http://localhost:8000/posts',{title:'3333',author:'lee'})
    }
    const ajax3 =()=>{
        axios.patch('http://localhost:8000/posts/1',{title:'1111-改'})
    }
    const ajax4 =()=>{
        axios.delete('http://localhost:8000/posts/1')
    }
    const ajax5 =()=>{
        axios.get('http://localhost:8000/posts/2?_embed=comments')
        .then(res=>{console.log(res.data);})
    }
    const ajax6 =()=>{  
        axios.get('http://localhost:8000/comments/2?_expand=post')
        .then(res=>{console.log(res.data);})
    }
    return (
        <div>
            <Button type="primary" onClick={ajax}>取数据</Button>
            <Button type="primary" onClick={ajax2}>增数据</Button>
            <Button type="primary" onClick={ajax3}>改数据</Button>
            <Button type="primary" onClick={ajax4}>删数据</Button>
            <Button type="primary" onClick={ajax5}>向下关联取数据</Button>
            <Button type="primary" onClick={ajax6}>向上关联取数据</Button>
        </div>  
    )
}
 