// 获取假期日历列表
export const getCalendarList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'total': 100,
      'page': 1,
      'page_size': 1,
      'list': [
        {'id': 1, 'name': 'xxx'},
        {'id': 2, 'name': 'aaa'},
        {'id': 3, 'name': 'bbb'},
        {'id': 4, 'name': 'ccc'},
        {'id': 5, 'name': 'ddd'}
      ]
    }
  }
}

// 获取树形结构管理范围
export const getScopeTree = req => {
  return {
    "code": 200,
    "message": "success",
    "data": [
        {
            "pid": -1,
            "code": "01",
            "children": [
                {
                    "pid": 0,
                    "code": "01",
                    "children": [
                        {
                            "pid": 6,
                            "code": "02",
                            "children": [
                                {
                                    "pid": 7,
                                    "code": "0123456789",
                                    "children": [
                                        {
                                            "pid": 16,
                                            "code": "789456",
                                            "children": [],
                                            "nodeId": "17",
                                            "nodeParentId": "16",
                                            "key": 17,
                                            "title": "G-02-01-01"
                                        }
                                    ],
                                    "nodeId": "16",
                                    "nodeParentId": "7",
                                    "key": 16,
                                    "title": "G-02-01"
                                }
                            ],
                            "nodeId": "7",
                            "nodeParentId": "6",
                            "key": 7,
                            "title": "G-02"
                        },
                        {
                            "pid": 6,
                            "code": "03",
                            "children": [],
                            "nodeId": "8",
                            "nodeParentId": "6",
                            "key": 8,
                            "title": "G-03"
                        },
                        {
                            "pid": 6,
                            "code": "12345645456456",
                            "children": [],
                            "nodeId": "22",
                            "nodeParentId": "6",
                            "key": 22,
                            "title": "G-01-01"
                        }
                    ],
                    "nodeId": "6",
                    "nodeParentId": "0",
                    "key": 6,
                    "title": "G-01"
                },
                {
                    "pid": 0,
                    "code": "04",
                    "children": [
                        {
                            "pid": 9,
                            "code": "05",
                            "children": [],
                            "nodeId": "10",
                            "nodeParentId": "9",
                            "key": 10,
                            "title": "Gg-05"
                        },
                        {
                            "pid": 9,
                            "code": "06",
                            "children": [],
                            "nodeId": "11",
                            "nodeParentId": "9",
                            "key": 11,
                            "title": "g-06"
                        }
                    ],
                    "nodeId": "9",
                    "nodeParentId": "0",
                    "key": 9,
                    "title": "G-04"
                },
                {
                    "pid": 0,
                    "code": "123",
                    "children": [],
                    "nodeId": "12",
                    "nodeParentId": "0",
                    "key": 12,
                    "title": "安迅"
                },
                {
                    "pid": 0,
                    "code": "1231",
                    "children": [],
                    "nodeId": "13",
                    "nodeParentId": "0",
                    "key": 13,
                    "title": "安迅1"
                },
                {
                    "pid": 0,
                    "code": "123456",
                    "children": [],
                    "nodeId": "14",
                    "nodeParentId": "0",
                    "key": 14,
                    "title": "安迅物流"
                },
                {
                    "pid": 0,
                    "code": "1234567",
                    "children": [],
                    "nodeId": "15",
                    "nodeParentId": "0",
                    "key": 15,
                    "title": "安迅物流"
                },
                {
                    "pid": 0,
                    "code": "123456789",
                    "children": [],
                    "nodeId": "18",
                    "nodeParentId": "0",
                    "key": 18,
                    "title": "家装"
                },
                {
                    "pid": 0,
                    "code": "12312312312",
                    "children": [],
                    "nodeId": "19",
                    "nodeParentId": "0",
                    "key": 19,
                    "title": "酒窖"
                },
                {
                    "pid": 0,
                    "code": "789948949",
                    "children": [],
                    "nodeId": "20",
                    "nodeParentId": "0",
                    "key": 20,
                    "title": "东北大区"
                },
                {
                    "pid": 0,
                    "code": "12312312312312",
                    "children": [],
                    "nodeId": "21",
                    "nodeParentId": "0",
                    "key": 21,
                    "title": "华北大区"
                }
            ],
            "nodeId": "0",
            "nodeParentId": "-1",
            "key": 0,
            "title": "GOME"
        }
    ]
}
}