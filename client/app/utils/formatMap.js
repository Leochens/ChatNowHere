// 将服务端发来的消息映射成本地存储格式的消息
export const msgMapToLocalRecord = (msg) => ({
    friend_id: msg.from_id,
    friend_name: msg.from_name,
    create_time: msg.create_time,
    content: msg.content,
    send_type: msg.type,// 自己的 1 对方的 2 系统 3
    type: 1, // 文本 1 图片 2
    msg_status: msg.msg_status

})

// 将服务端发来的消息映射成本地好友消息列表的格式
export const msgMapToChatItem = msg => ({
    friend_id: parseInt(msg.from_id),
    friend_name: msg.from_name,
    friend_pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=517389657,4030031755&fm=200&gp=0.jpg',
    last_msg_content: msg.content,
    last_msg_time: msg.create_time,
    new_msg_count: 1
})

