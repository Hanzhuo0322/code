import {getDiffDate} from '../util';
import SingleItem from './SingleItem';
//Preact版本
/*
import {h, Component} from 'preact';

export class MainMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectType: 0,
            targetId: '',
            authorUid: '',
            totalNum: 0,
            realDataList: [],
            baseUrl: '',
            uaType: -1
        };
        this.pageLen = 10;
    }

    changeType(event) {
        let that = this;
        this.setState({selectType: event.target.value}, () => {
            that.getCounts(0)
        })
    }

    changeUaType(event) {
        let that = this;
        that.setState({uaType: event.target.value}, () => {
            that.getCounts(0);
        })

    }

    changeTarget(event) {
        let that = this;
        this.setState({targetId: event.target.value}, () => {
            if (that.state.targetId.length == 0) {
                that.getCounts(0)
            }
        })
    }

    changeAuthor(event) {
        let that = this;
        this.setState({authorUid: event.target.value}, () => {
            if (that.state.authorUid.length == 0) {
                that.getCounts(0)
            }
        })
    }

    getCounts(start) {
        let that = this;
        $.ajax({
            url: '/qun-audit/ajax/real/search/total',
            type: 'get',
            data: {
                targetId: that.state.targetId,
                type: that.state.selectType,
                authorUid: that.state.authorUid,
                from: $($('.calendar')[0]).val(),
                to: $($('.calendar')[1]).val(),
                start: start
            },
            dataType: 'json',
            success: function (data) {
                if (data && data.total) {
                    that.setState({totalNum: data.total}, () => {
                        if (that.state.totalNum > 0) {
                            that.initPaging(that.state.totalNum);
                        } else if (that.state.totalNum == 0) {
                            $('#paging').twbsPagination('destroy')
                        }
                    })
                } else {
                    that.setState({totalNum: 0, realDataList: []}, () => {
                        $('#paging').twbsPagination('destroy')
                    })
                }
            }
        })
    }

    // 请求数据
    clickSearch(start) { // flag参数标识是否需要重置分页组件 true需要 false不需要
        let that = this;
        $.ajax({
            url: '/qun-audit/ajax/real/search',
            type: 'get',
            data: {
                targetId: that.state.targetId,
                type: that.state.selectType,
                uaType: that.state.uaType,
                authorUid: that.state.authorUid,
                from: $($('.calendar')[0]).val(),
                to: $($('.calendar')[1]).val(),
                start: start
            },
            dataType: 'json',
            success: function (data) {
                if (data && data.realDataList && data.realDataList.length >= 0) {
                    that.setState({
                        realDataList: data.realDataList,
                        baseUrl: data.baseUrl
                    })
                }
            }
        })
    }

    // 初始化分页组件
    initPaging(len) {
        let that = this;
        $('#paging').twbsPagination('destroy')
        $('#paging').twbsPagination({
            totalPages: Math.ceil(len / that.pageLen),
            startPage: 1,
            visiblePages: 5,
            hideOnlyOnePage: true,
            first: '首页',
            prev: '上一页',
            next: '下一页',
            last: '末页',
            onPageClick: function (evt, page) {
                // 每页发请求
                that.clickSearch((page - 1) * 10)
            }
        })
    }

    componentDidMount() {
        let that = this;

        $($('.replace')[0]).replaceWith(`
        <input type="text" id="date-start" readonly
               onfocus="this.blur();WdatePicker({skin:'whyGreen',isShowClear:false,dateFmt:'yyyy-MM-dd',minDate: '2017-01-01', maxDate:'%y-%M-{%d}',onpicked:function() {
                 PubSub.publish('refreshData')
               }})" class="form-control search-time calendar Wdate" style="width: 186px;height: 33px;"/>
    `)

        $($('.replace')[0]).replaceWith(`
      <input type="text" id="date-end" readonly
               onfocus="this.blur();WdatePicker({skin:'whyGreen',isShowClear:false,dateFmt:'yyyy-MM-dd',minDate: '2017-01-01', maxDate:'%y-%M-{%d}',onpicked:function() {
                 PubSub.publish('refreshData')
               }})" class="form-control search-time calendar Wdate" style="width: 186px;height: 33px;"/>
    `)

        const start = getDiffDate(-7);
        const end = getDiffDate(0);

        $($('.calendar')[0]).val(start);
        $($('.calendar')[1]).val(end);

        that.getCounts(0);

        PubSub.subscribe('refreshData', () => {
            that.getCounts(0);
        })
    }


    render() {
        return (
            <div>
                <form className="am-form-inline" name="timeselect">
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "100px", height: "37px"}} value={this.state.selectType}
                                onChange={this.changeType.bind(this)}>
                            <option value="0">全部</option>
                            <option value="1">提问</option>
                            <option value="2">回答</option>
                            <option value="3">文章</option>
                            <option value="4">PK</option>
                            <option value="5">投票</option>
                            <option value="102">回答评论</option>
                            <option value="103">文章评论</option>
                            <option value="111">影评评论</option>
                            <option value="112">留星语评论</option>
                            <option value="113">书评评论</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "100px", height: "37px"}} value={this.state.uaType}
                                onChange={this.changeUaType.bind(this)}>
                            <option value={-1}>全部来源</option>
                            <option value={253}>PC</option>
                            <option value={254}>WAP</option>
                            <option value={255}>APP</option>
                            <option value={0}>未知来源</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <input type="text" name="targetId" className="am-form-field am-radius" placeholder="请输入targetId"
                           value={this.state.targetId} onInput={this.changeTarget.bind(this)}/>
                    <input type="text" name="authorUid" className="am-form-field am-radius" placeholder="请输入作者ID"
                           value={this.state.authorUid} onInput={this.changeAuthor.bind(this)}/>
                    <div className="am-form-group am-form-icon">
                        <div className="replace"></div>
                        <span className="am-icon-calendar"></span>
                    </div>
                    <div className="am-form-group am-form-icon">
                        <div className="replace"></div>
                        <span className="am-icon-calendar"></span>
                    </div>
                    <button className="am-btn am-btn-default am-radius" onClick={(event) => {
                        // 阻止form表单的默认行为 防止跳转页面 很重要
                        event.stopPropagation();
                        event.preventDefault();
                        this.getCounts();
                    }}>查询
                    </button>
                </form>

                <div className="am-scrollable-horizontal">
                    {this.state.realDataList && this.state.realDataList.length > 0 ?
                        <table className="am-table am-table-bordered am-text-nowrap"
                               style={{width: "auto", marginTop: '20px', marginLeft: "auto", marginRight: 'auto'}}>
                            <thead>
                            <tr>
                                <th>类型 | 来源</th>
                                <th colSpan="2">用户信息</th>
                                <th>时间</th>
                                <th>内容</th>
                                <th>PV</th>
                                <th>点赞</th>
                                <th>回答/评论</th>
                                <th colSpan="2">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.realDataList.map((item, index) => {
                                return <SingleItem data={item} key={item.id} baseUrl={this.state.baseUrl}/>
                            })}
                            </tbody>
                        </table> : <p>暂无内容</p>
                    }
                </div>
                <div id="paging"></div>
            </div>
        )
    }
}*/

//react版本
/*export default class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectType: 0,
            targetId: '',
            authorUid: '',
            totalNum: 0,
            realDataList: [],
            baseUrl: '',
            uaType: -1
        };
        this.pageLen = 10;
    }

    changeType(event) {
        let that = this;
        this.setState({selectType: event.target.value}, () => {
            that.getCounts(0)
        })
    }

    changeUaType(event) {
        let that = this;
        that.setState({uaType: event.target.value}, () => {
            that.getCounts(0);
        })

    }

    changeTarget(event) {
        let that = this;
        this.setState({targetId: event.target.value}, () => {
            if (that.state.targetId.length == 0) {
                that.getCounts(0)
            }
        })
    }

    changeAuthor(event) {
        let that = this;
        this.setState({authorUid: event.target.value}, () => {
            if (that.state.authorUid.length == 0) {
                that.getCounts(0)
            }
        })
    }

    getCounts(start) {
        let that = this;
        $.ajax({
            url: '/qun-audit/ajax/real/search/total',
            type: 'get',
            data: {
                targetId: that.state.targetId,
                type: that.state.selectType,
                authorUid: that.state.authorUid,
                from: $($('.calendar')[0]).val(),
                to: $($('.calendar')[1]).val(),
                start: start
            },
            dataType: 'json',
            success: function (data) {
                if (data && data.total) {
                    that.setState({totalNum: data.total}, () => {
                        if (that.state.totalNum > 0) {
                            that.initPaging(that.state.totalNum);
                        } else if (that.state.totalNum == 0) {
                            $('#paging').twbsPagination('destroy')
                        }
                    })
                } else {
                    that.setState({totalNum: 0, realDataList: []}, () => {
                        $('#paging').twbsPagination('destroy')
                    })
                }
            }
        })
    }

    // 请求数据
    clickSearch(start) { // flag参数标识是否需要重置分页组件 true需要 false不需要
        let that = this;
        $.ajax({
            url: '/qun-audit/ajax/real/search',
            type: 'get',
            data: {
                targetId: that.state.targetId,
                type: that.state.selectType,
                uaType: that.state.uaType,
                authorUid: that.state.authorUid,
                from: $($('.calendar')[0]).val(),
                to: $($('.calendar')[1]).val(),
                start: start
            },
            dataType: 'json',
            success: function (data) {
                if (data && data.realDataList && data.realDataList.length >= 0) {
                    that.setState({
                        realDataList: data.realDataList,
                        baseUrl: data.baseUrl
                    })
                }
            }
        })
    }

    // 初始化分页组件
    initPaging(len) {
        let that = this;
        $('#paging').twbsPagination('destroy');
        $('#paging').twbsPagination({
            totalPages: Math.ceil(len / that.pageLen),
            startPage: 1,
            visiblePages: 5,
            hideOnlyOnePage: true,
            first: '首页',
            prev: '上一页',
            next: '下一页',
            last: '末页',
            onPageClick: function (evt, page) {
                // 每页发请求
                that.clickSearch((page - 1) * 10)
            }
        })
    }

    componentDidMount() {
        let that = this;

        $($('.replace')[0]).replaceWith(`
        <input type="text" id="date-start" readonly
               onfocus="this.blur();WdatePicker({skin:'whyGreen',isShowClear:false,dateFmt:'yyyy-MM-dd',minDate: '2017-01-01', maxDate:'%y-%M-{%d}',onpicked:function() {
                 PubSub.publish('refreshData')
               }})" class="form-control search-time calendar Wdate" style="width: 186px;height: 33px;"/>
    `);

        $($('.replace')[0]).replaceWith(`
      <input type="text" id="date-end" readonly
               onfocus="this.blur();WdatePicker({skin:'whyGreen',isShowClear:false,dateFmt:'yyyy-MM-dd',minDate: '2017-01-01', maxDate:'%y-%M-{%d}',onpicked:function() {
                 PubSub.publish('refreshData')
               }})" class="form-control search-time calendar Wdate" style="width: 186px;height: 33px;"/>
    `);

        const start = getDiffDate(-7);
        const end = getDiffDate(0);

        $($('.calendar')[0]).val(start);
        $($('.calendar')[1]).val(end);

        that.getCounts(0);

        PubSub.subscribe('refreshData', () => {
            that.getCounts(0);
        })
    }


    render() {
        return (
            <div>
                <form className="am-form-inline" name="timeselect">
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "100px", height: "37px"}} value={this.state.selectType}
                                onChange={this.changeType.bind(this)}>
                            <option value="0">全部</option>
                            <option value="1">提问</option>
                            <option value="2">回答</option>
                            <option value="3">文章</option>
                            <option value="4">PK</option>
                            <option value="5">投票</option>
                            <option value="102">回答评论</option>
                            <option value="103">文章评论</option>
                            <option value="111">影评评论</option>
                            <option value="112">留星语评论</option>
                            <option value="113">书评评论</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "100px", height: "37px"}} value={this.state.uaType}
                                onChange={this.changeUaType.bind(this)}>
                            <option value={-1}>全部来源</option>
                            <option value={253}>PC</option>
                            <option value={254}>WAP</option>
                            <option value={255}>APP</option>
                            <option value={0}>未知来源</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <input type="text" name="targetId" className="am-form-field am-radius" placeholder="请输入targetId"
                           value={this.state.targetId} onInput={this.changeTarget.bind(this)}/>
                    <input type="text" name="authorUid" className="am-form-field am-radius" placeholder="请输入作者ID"
                           value={this.state.authorUid} onInput={this.changeAuthor.bind(this)}/>
                    <div className="am-form-group am-form-icon">
                        <div className="replace"></div>
                        <span className="am-icon-calendar"></span>
                    </div>
                    <div className="am-form-group am-form-icon">
                        <div className="replace"></div>
                        <span className="am-icon-calendar"></span>
                    </div>
                    <button className="am-btn am-btn-default am-radius" onClick={(event) => {
                        // 阻止form表单的默认行为 防止跳转页面 很重要
                        event.stopPropagation();
                        event.preventDefault();
                        this.getCounts();
                    }}>查询
                    </button>
                </form>

                <div className="am-scrollable-horizontal">
                    {this.state.realDataList && this.state.realDataList.length > 0 ?
                        <table className="am-table am-table-bordered am-text-nowrap"
                               style={{width: "auto", marginTop: '20px', marginLeft: "auto", marginRight: 'auto'}}>
                            <thead>
                            <tr>
                                <th>类型 | 来源</th>
                                <th colSpan="2">用户信息</th>
                                <th>时间</th>
                                <th>内容</th>
                                <th>PV</th>
                                <th>点赞</th>
                                <th>回答/评论</th>
                                <th colSpan="2">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.realDataList.map((item, index) => {
                                return <SingleItem data={item} key={item.id} baseUrl={this.state.baseUrl}/>
                            })}
                            </tbody>
                        </table> : <p>暂无内容</p>
                    }
                </div>
                <div id="paging"></div>
            </div>
        );
    }
}*/

//新增需求1.0           静态 接口参数不全
/*
export default class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 1,
            visibility: 'hidden',
            selectState: 'n',

            selectType: 0,
            targetId: '',
            authorUid: '',
            uaType: -1,

            totalNum: 0,

            realDataList: [],
            baseUrl: ''

        };
        this.pageLen = 10;
    }
    //有无状态
    changeState(event) {
        let that = this;
        this.setState(
            {selectState: event.target.value,visibility:this.state.visibility == 'hidden'?'visible':'hidden'}
        );
    }
    //四种状态
    changeStatus(event) {
        let that = this;
        this.setState(
            {status: event.target.value},
            () => {

            }
        );
    }
    changeType(event) {
        let that = this;
        this.setState({selectType: event.target.value}, () => {
            that.getCounts(0)
        })
    }

    changeUaType(event) {
        let that = this;
        that.setState({uaType: event.target.value}, () => {
            that.getCounts(0);
        })

    }

    changeTarget(event) {
        let that = this;
        this.setState({targetId: event.target.value}, () => {
            if (that.state.targetId.length == 0) {
                that.getCounts(0)
            }
        })
    }

    changeAuthor(event) {
        let that = this;
        this.setState({authorUid: event.target.value}, () => {
            if (that.state.authorUid.length == 0) {
                that.getCounts(0)
            }
        })
    }

    getCounts(start) {
        let that = this;
        $.ajax({
            url: '/qun-audit/ajax/real/search/total',
            type: 'get',
            data: {
                targetId: that.state.targetId,
                type: that.state.selectType,
                authorUid: that.state.authorUid,
                from: $($('.calendar')[0]).val(),
                to: $($('.calendar')[1]).val(),
                start: start
            },
            dataType: 'json',
            success: function (data) {
                if (data && data.total) {
                    that.setState({totalNum: data.total}, () => {
                        if (that.state.totalNum > 0) {
                            that.initPaging(that.state.totalNum);
                        } else if (that.state.totalNum == 0) {
                            $('#paging').twbsPagination('destroy')
                        }
                    })
                } else {
                    that.setState({totalNum: 0, realDataList: []}, () => {
                        $('#paging').twbsPagination('destroy')
                    })
                }
            }
        })
    }

    // 请求数据
    clickSearch(start) { // flag参数标识是否需要重置分页组件 true需要 false不需要
        let that = this;
        $.ajax({
            url: '/qun-audit/ajax/real/search',
            type: 'get',
            data: {
                targetId: that.state.targetId,
                type: that.state.selectType,
                uaType: that.state.uaType,
                authorUid: that.state.authorUid,
                from: $($('.calendar')[0]).val(),
                to: $($('.calendar')[1]).val(),
                start: start
            },
            dataType: 'json',
            success: function (data) {
                if (data && data.realDataList && data.realDataList.length >= 0) {
                    that.setState({
                        realDataList: data.realDataList,
                        baseUrl: data.baseUrl
                    })
                }
            }
        })
    }

    // 初始化分页组件
    initPaging(len) {
        let that = this;
        $('#paging').twbsPagination('destroy');
        $('#paging').twbsPagination({
            totalPages: Math.ceil(len / that.pageLen),
            startPage: 1,
            visiblePages: 5,
            hideOnlyOnePage: true,
            first: '首页',
            prev: '上一页',
            next: '下一页',
            last: '末页',
            onPageClick: function (evt, page) {
                // 每页发请求
                that.clickSearch((page - 1) * 10)
            }
        })
    }

    componentDidMount() {
        let that = this;

        $($('.replace')[0]).replaceWith(`
        <input type="text" id="date-start" readonly
               onfocus="this.blur();WdatePicker({skin:'whyGreen',isShowClear:false,dateFmt:'yyyy-MM-dd',minDate: '2017-01-01', maxDate:'%y-%M-{%d}',onpicked:function() {
                 PubSub.publish('refreshData')
               }})" class="form-control search-time calendar Wdate" style="width: 186px;height: 33px;"/>
    `);

        $($('.replace')[0]).replaceWith(`
      <input type="text" id="date-end" readonly
               onfocus="this.blur();WdatePicker({skin:'whyGreen',isShowClear:false,dateFmt:'yyyy-MM-dd',minDate: '2017-01-01', maxDate:'%y-%M-{%d}',onpicked:function() {
                 PubSub.publish('refreshData')
               }})" class="form-control search-time calendar Wdate" style="width: 186px;height: 33px;"/>
    `);

        const start = getDiffDate(-7);
        const end = getDiffDate(0);

        $($('.calendar')[0]).val(start);
        $($('.calendar')[1]).val(end);

        that.getCounts(0);

        PubSub.subscribe('refreshData', () => {
            that.getCounts(0);
        })
    }


    render() {
        return (
            <div>
                <form className="am-form-inline" name="timeselect">
                    {/!*状态*!/}
                    <div className="am-form-group am-form-select" style={{visibility:this.state.visibility}}>
                        <select name="type" style={{width: "80px", height: "37px"}} value={this.state.status}
                                >
                            <option value="1">空点赞</option>
                            <option value="2">空回答</option>
                            <option value="3">求点赞</option>
                            <option value="4">求互动</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    {/!*选择状态*!/}
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "80px", height: "37px"}} value={this.state.selectState}
                                onChange={this.changeState.bind(this)}>
                            <option value="n">无状态</option>
                            <option value="y">有状态</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "100px", height: "37px"}} value={this.state.selectType}
                                onChange={this.changeType.bind(this)}>
                            <option value="0">全部</option>
                            <option value="1">提问</option>
                            <option value="2">回答</option>
                            <option value="3">文章</option>
                            <option value="4">PK</option>
                            <option value="5">投票</option>
                            <option value="102">回答评论</option>
                            <option value="103">文章评论</option>
                            <option value="111">影评评论</option>
                            <option value="112">留星语评论</option>
                            <option value="113">书评评论</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "100px", height: "37px"}} value={this.state.uaType}
                                onChange={this.changeUaType.bind(this)}>
                            <option value={-1}>全部来源</option>
                            <option value={253}>PC</option>
                            <option value={254}>WAP</option>
                            <option value={255}>APP</option>
                            <option value={0}>未知来源</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <input type="text" name="targetId" className="am-form-field am-radius" placeholder="请输入targetId"
                           value={this.state.targetId} onInput={this.changeTarget.bind(this)}/>
                    <input type="text" name="authorUid" className="am-form-field am-radius" placeholder="请输入作者ID"
                           value={this.state.authorUid} onInput={this.changeAuthor.bind(this)}/>
                    <div className="am-form-group am-form-icon">
                        <div className="replace"></div>
                        <span className="am-icon-calendar"></span>
                    </div>
                    <div className="am-form-group am-form-icon">
                        <div className="replace"></div>
                        <span className="am-icon-calendar"></span>
                    </div>
                    <button className="am-btn am-btn-default am-radius" onClick={(event) => {
                        // 阻止form表单的默认行为 防止跳转页面 很重要
                        event.stopPropagation();
                        event.preventDefault();
                        this.getCounts();
                    }}>查询
                    </button>
                </form>

                <div className="am-scrollable-horizontal">
                    {this.state.realDataList && this.state.realDataList.length > 0 ?
                        <table className="am-table am-table-bordered am-text-nowrap"
                               style={{width: "auto", marginTop: '20px', marginLeft: "auto", marginRight: 'auto'}}>
                            <thead>
                            <tr>
                                <th>类型 | 来源</th>
                                <th colSpan="2">用户信息</th>
                                <th>时间</th>
                                <th>内容</th>
                                <th>PV</th>
                                <th>点赞</th>
                                <th>回答/评论</th>
                                <th colSpan="2">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.realDataList.map((item, index) => {
                                return <SingleItem data={item} key={item.id} baseUrl={this.state.baseUrl}/>
                            })}
                            </tbody>
                        </table> : <p>暂无内容</p>
                    }
                </div>
                <div id="paging"></div>
            </div>
        );
    }
}*/

//新增需求2.0           添加新增参数  初步实现需求 待解决问题：特殊情况上一页下一页的禁止点击 , 接口重复请求
/*export default class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visibility: 'hidden',//显示与隐藏
            selectState: 'n',//选择有无状态

            status: 1,   //四种状态的参数  new
            lastId: 0,   // 下一页时的start new
            firstId: 0,  // 上一页时的start  new
            retCode:0,   // 0:success     -1:没有更多数据    现在因为不能提前判断还有没有数据，所以给一个return code  new

            selectType: 0,  //type 类型 old
            targetId: '',   //输入框1  目标ID   old
            authorUid: '',  //输入框2 作者ID   old
            uaType: -1,     //来源  默认为-1表示全部  old

            totalNum: 0,//

            realDataList: [],
            baseUrl: ''

        };
        this.pageLen = 10;
    }
    //四种状态
    changeStatus(event) {
        let that = this;
        this.setState(
            {status: event.target.value},
            () => {
                that.getCounts(0)
            }
        );
    }
    //有无状态
    changeState(event) {
        let that = this;
        this.setState(
            {selectState: event.target.value , visibility:this.state.visibility == 'hidden'?'visible':'hidden'},
            () => {
                $('#paging').twbsPagination('destroy');
                that.getCounts(0)
            }
        );
    }
    //选择类型
    changeType(event) {
        let that = this;
        this.setState({selectType: event.target.value}, () => {
            that.getCounts(0)
        })
    }
    //选择来源
    changeUaType(event) {
        let that = this;
        that.setState({uaType: event.target.value}, () => {
            that.getCounts(0);
        })

    }
    //目标ID
    changeTarget(event) {
        let that = this;
        this.setState({targetId: event.target.value}, () => {
            if (that.state.targetId.length == 0) {
                that.getCounts(0)
            }
        })
    }
    //作者ID
    changeAuthor(event) {
        let that = this;
        this.setState({authorUid: event.target.value}, () => {
            if (that.state.authorUid.length == 0) {
                that.getCounts(0)
            }
        })
    }

    getCounts(start) {
        let that = this;
        if(this.state.visibility == "hidden"){
            $.ajax({
                url: '/qun-audit/ajax/real/search/total',
                type: 'get',
                data: {
                    targetId: that.state.targetId,
                    type: that.state.selectType,
                    authorUid: that.state.authorUid,
                    from: $($('.calendar')[0]).val(),
                    to: $($('.calendar')[1]).val(),
                    start: start
                },
                dataType: 'json',
                success: function (data) {
                    if (data && data.total) {
                        that.setState({totalNum: data.total}, () => {
                            if (that.state.totalNum > 0) {
                                that.initPaging(that.state.totalNum);
                            } else if (that.state.totalNum == 0) {
                                $('#paging').twbsPagination('destroy')
                            }
                        })
                    } else {
                        that.setState({totalNum: 0, realDataList: []}, () => {
                            $('#paging').twbsPagination('destroy')
                        })
                    }
                }
            })
        }else if(this.state.visibility == "visible"){
            $.ajax({
                url: '/qun-audit/ajax/real/search-by-status',
                type: 'get',
                data: {
                    targetId: that.state.targetId,
                    type: that.state.selectType,
                    authorUid: that.state.authorUid,
                    from: $($('.calendar')[0]).val(),
                    to: $($('.calendar')[1]).val(),
                    start: start,

                    status: that.state.status,
                    retCode: that.state.retCode
                },
                dataType: 'json',
                success: function (data) {
                    if (data && data.retCode == 0) {
                        that.setState({totalNum: data.retCode}, () => {
                            /!*if (that.state.totalNum > 0) {
                                //that.initPaging(that.state.totalNum);

                            } else if (that.state.totalNum == 0) {
                                //$('#paging').twbsPagination('destroy')

                            }*!/
                            that.clickSearch(start)
                        })
                    } else {
                        that.setState({totalNum: 0, realDataList: []}, () => {
                            that.clickSearch(start)

                        });
                    }
                }
            })
        }

    }
    // 请求数据
    clickSearch(start) { // flag参数标识是否需要重置分页组件 true需要 false不需要
        let that = this;
        if(this.state.visibility == 'hidden'){
            $.ajax({
                url: '/qun-audit/ajax/real/search',
                type: 'get',
                data: {
                    targetId: that.state.targetId,
                    type: that.state.selectType,
                    uaType: that.state.uaType,
                    authorUid: that.state.authorUid,
                    from: $($('.calendar')[0]).val(),
                    to: $($('.calendar')[1]).val(),
                    start: start
                },
                dataType: 'json',
                success: function (data) {
                    if (data && data.realDataList && data.realDataList.length >= 0) {
                        that.setState({
                            realDataList: data.realDataList,
                            baseUrl: data.baseUrl
                        })
                    }
                }
            })
        }else{
            $.ajax({
                url: '/qun-audit/ajax/real/search-by-status',
                type: 'get',
                data: {
                    targetId: that.state.targetId,
                    type: that.state.selectType,
                    uaType: that.state.uaType,
                    authorUid: that.state.authorUid,
                    from: $($('.calendar')[0]).val(),
                    to: $($('.calendar')[1]).val(),
                    start: start,
                    status: that.state.status,
                    lastId: that.state.lastId,
                    firstId: that.state.firstId
                },
                dataType: 'json',
                success: function (data) {
                    if (data && data.realDataList && data.realDataList.length >= 0 ) {
                        that.setState({
                            realDataList: data.realDataList,
                            baseUrl: data.baseUrl,
                            retCode:data.retCode
                        }/!*,()=>{
                            $('#pageBtn').css("display","block");
                        }*!/)
                    }/!*else if( data && data.realDataList && data.realDataList.length <= 10 && data.realDataList.length >= 0){
                        that.setState({
                            realDataList: data.realDataList,
                            baseUrl: data.baseUrl,
                            retCode:data.retCode
                        },()=>{
                            $('#pageBtn').css("display","none");
                        })
                    }*!/
                }
            })
        }
    }
    // 初始化分页组件
    initPaging(len) {
        let that = this;
        $('#paging').twbsPagination('destroy');
        $('#paging').twbsPagination({
            totalPages: Math.ceil(len / that.pageLen),
            startPage: 1,
            visiblePages: 5,
            hideOnlyOnePage: true,
            first: '首页',
            prev: '上一页',
            next: '下一页',
            last: '末页',
            onPageClick: function (evt, page) {
                // 每页发请求
                that.clickSearch((page - 1) * 10)
            }
        })
    }
    clickPageButton(pageType){
        let that = this;
        $.ajax({
            url: '/qun-audit/ajax/real/search-by-status',
            type: 'get',
            data: {
                targetId: that.state.targetId,
                type: that.state.selectType,
                uaType: that.state.uaType,
                authorUid: that.state.authorUid,
                from: $($('.calendar')[0]).val(),
                to: $($('.calendar')[1]).val(),
                status: that.state.status,
                lastId: that.state.lastId,
                firstId: that.state.firstId
            },
            dataType: 'json',
            success: function (data) {
                if (data && data.realDataList && data.realDataList.length >= 0) {
                    that.setState({
                        realDataList: data.realDataList,
                        baseUrl: data.baseUrl,
                        retCode:data.retCode
                    },() => {
                        if(pageType == 1){
                            that.clickSearch(data.lastId);
                        }else if(pageType == 2){
                            that.clickSearch(data.firstId);
                        }

                    })
                }
            }
        })
    }

    componentDidMount() {
        let that = this;

        $($('.replace')[0]).replaceWith(`
        <input type="text" id="date-start" readonly
               onfocus="this.blur();WdatePicker({skin:'whyGreen',isShowClear:false,dateFmt:'yyyy-MM-dd',minDate: '2017-01-01', maxDate:'%y-%M-{%d}',onpicked:function() {
                 PubSub.publish('refreshData')
               }})" class="form-control search-time calendar Wdate" style="width: 186px;height: 33px;"/>
    `);

        $($('.replace')[0]).replaceWith(`
      <input type="text" id="date-end" readonly
               onfocus="this.blur();WdatePicker({skin:'whyGreen',isShowClear:false,dateFmt:'yyyy-MM-dd',minDate: '2017-01-01', maxDate:'%y-%M-{%d}',onpicked:function() {
                 PubSub.publish('refreshData')
               }})" class="form-control search-time calendar Wdate" style="width: 186px;height: 33px;"/>
    `);

        const start = getDiffDate(-7);
        const end = getDiffDate(0);

        $($('.calendar')[0]).val(start);
        $($('.calendar')[1]).val(end);

        that.getCounts(0);

        PubSub.subscribe('refreshData', () => {
            that.getCounts(0);
        })
    }

    render() {
        return (
            <div>
                <form className="am-form-inline" name="timeselect">
                    {/!*状态*!/}
                    <div className="am-form-group am-form-select" style={{visibility:this.state.visibility}} value={this.state.status}
                         onChange={this.changeStatus.bind(this)}>
                        <select name="type" style={{width: "80px", height: "37px"}} value={this.state.status}
                        >
                            <option value="1">空点赞</option>
                            <option value="2">空回答</option>
                            <option value="3">求点赞</option>
                            <option value="4">求互动</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    {/!*选择状态*!/}
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "80px", height: "37px"}} value={this.state.selectState}
                                onChange={this.changeState.bind(this)}>
                            <option value="n">无状态</option>
                            <option value="y">有状态</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "100px", height: "37px"}} value={this.state.selectType}
                                onChange={this.changeType.bind(this)}>
                            <option value="0">全部</option>
                            <option value="1">提问</option>
                            <option value="2">回答</option>
                            <option value="3">文章</option>
                            <option value="4">PK</option>
                            <option value="5">投票</option>
                            <option value="102">回答评论</option>
                            <option value="103">文章评论</option>
                            <option value="111">影评评论</option>
                            <option value="112">留星语评论</option>
                            <option value="113">书评评论</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "100px", height: "37px"}} value={this.state.uaType}
                                onChange={this.changeUaType.bind(this)}>
                            <option value={-1}>全部来源</option>
                            <option value={253}>PC</option>
                            <option value={254}>WAP</option>
                            <option value={255}>APP</option>
                            <option value={0}>未知来源</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <input type="text" name="targetId" className="am-form-field am-radius" placeholder="请输入targetId"
                           value={this.state.targetId} onInput={this.changeTarget.bind(this)}/>
                    <input type="text" name="authorUid" className="am-form-field am-radius" placeholder="请输入作者ID"
                           value={this.state.authorUid} onInput={this.changeAuthor.bind(this)}/>
                    <div className="am-form-group am-form-icon">
                        <div className="replace"></div>
                        <span className="am-icon-calendar"></span>
                    </div>
                    <div className="am-form-group am-form-icon">
                        <div className="replace"></div>
                        <span className="am-icon-calendar"></span>
                    </div>
                    <button className="am-btn am-btn-default am-radius" onClick={(event) => {
                        // 阻止form表单的默认行为 防止跳转页面 很重要
                        event.stopPropagation();
                        event.preventDefault();
                        this.getCounts();
                    }}>查询
                    </button>
                </form>

                <div className="am-scrollable-horizontal">
                    {this.state.realDataList && this.state.realDataList.length > 0 ?
                        <table className="am-table am-table-bordered am-text-nowrap"
                               style={{width: "auto", marginTop: '20px', marginLeft: "auto", marginRight: 'auto'}}>
                            <thead>
                            <tr>
                                <th>类型 | 来源</th>
                                <th colSpan="2">用户信息</th>
                                <th>时间</th>
                                <th>内容</th>
                                <th>PV</th>
                                <th>点赞</th>
                                <th>回答/评论</th>
                                <th colSpan="2">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.realDataList.map((item, index) => {
                                return <SingleItem data={item} key={item.id} baseUrl={this.state.baseUrl}/>
                            })}
                            </tbody>
                        </table> : <p>暂无内容</p>
                    }
                </div>
                <div id="paging"></div>
                {this.state.selectState == 'n' ? null : <div id="pageBtn">
                    {this.state.start != 0 ? <button class="page-btn2" name="2" onClick={()=>this.clickPageButton(2)}>上一页</button> : null}
                    {this.state.retCode == 0 ? <button class="page-btn1" name="1" onClick={()=>this.clickPageButton(1)}>下一页</button> : null}
                </div>}
            </div>
        );
    }
}*/
    //新增需求2.1       上一页下一页按钮按照以前的风格添加样式
/*export default class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visibility: 'hidden',//显示与隐藏
            selectState: 'n',//选择有无状态

            status: 1,   //四种状态的参数  new
            lastId: 0,   // 下一页时的start new
            firstId: 0,  // 上一页时的start  new
            retCode:0,   // 0:success     -1:没有更多数据    现在因为不能提前判断还有没有数据，所以给一个return code  new

            selectType: 0,  //type 类型 old
            targetId: '',   //输入框1  目标ID   old
            authorUid: '',  //输入框2 作者ID   old
            uaType: -1,     //来源  默认为-1表示全部  old

            totalNum: 0,//

            realDataList: [],
            baseUrl: ''

        };
        this.pageLen = 10;
    }
    //四种状态
    changeStatus(event) {
        let that = this;
        this.setState(
            {status: event.target.value},
            () => {
                that.getCounts(0)
            }
        );
    }
    //有无状态
    changeState(event) {
        let that = this;
        this.setState(
            {selectState: event.target.value , visibility:this.state.visibility == 'hidden'?'visible':'hidden'},
            () => {
                $('#paging').twbsPagination('destroy');
                that.getCounts(0)
            }
        );
    }
    //选择类型
    changeType(event) {
        let that = this;
        this.setState({selectType: event.target.value}, () => {
            that.getCounts(0)
        })
    }
    //选择来源
    changeUaType(event) {
        let that = this;
        that.setState({uaType: event.target.value}, () => {
            that.getCounts(0);
        })

    }
    //目标ID
    changeTarget(event) {
        let that = this;
        this.setState({targetId: event.target.value}, () => {
            if (that.state.targetId.length == 0) {
                that.getCounts(0)
            }
        })
    }
    //作者ID
    changeAuthor(event) {
        let that = this;
        this.setState({authorUid: event.target.value}, () => {
            if (that.state.authorUid.length == 0) {
                that.getCounts(0)
            }
        })
    }

    getCounts(start) {
        let that = this;
        if(this.state.visibility == "hidden"){
            $.ajax({
                url: '/qun-audit/ajax/real/search/total',
                type: 'get',
                data: {
                    targetId: that.state.targetId,
                    type: that.state.selectType,
                    authorUid: that.state.authorUid,
                    from: $($('.calendar')[0]).val(),
                    to: $($('.calendar')[1]).val(),
                    start: start
                },
                dataType: 'json',
                success: function (data) {
                    if (data && data.total) {
                        that.setState({totalNum: data.total}, () => {
                            if (that.state.totalNum > 0) {
                                that.initPaging(that.state.totalNum);
                            } else if (that.state.totalNum == 0) {
                                $('#paging').twbsPagination('destroy')
                            }
                        })
                    } else {
                        that.setState({totalNum: 0, realDataList: []}, () => {
                            $('#paging').twbsPagination('destroy')
                        })
                    }
                }
            })
        }else if(this.state.visibility == "visible"){
            $.ajax({
                url: '/qun-audit/ajax/real/search-by-status',
                type: 'get',
                data: {
                    targetId: that.state.targetId,
                    type: that.state.selectType,
                    authorUid: that.state.authorUid,
                    from: $($('.calendar')[0]).val(),
                    to: $($('.calendar')[1]).val(),
                    start: start,

                    status: that.state.status,
                    retCode: that.state.retCode
                },
                dataType: 'json',
                success: function (data) {
                    if (data && data.retCode == 0) {
                        that.setState({totalNum: data.retCode}, () => {
                            /!*if (that.state.totalNum > 0) {
                                //that.initPaging(that.state.totalNum);

                            } else if (that.state.totalNum == 0) {
                                //$('#paging').twbsPagination('destroy')

                            }*!/
                            that.clickSearch(start)
                        })
                    } else {
                        that.setState({totalNum: 0, realDataList: []}, () => {
                            that.clickSearch(start)

                        });
                    }
                }
            })
        }

    }
    // 请求数据
    clickSearch(start) { // flag参数标识是否需要重置分页组件 true需要 false不需要
        let that = this;
        if(this.state.visibility == 'hidden'){
            $.ajax({
                url: '/qun-audit/ajax/real/search',
                type: 'get',
                data: {
                    targetId: that.state.targetId,
                    type: that.state.selectType,
                    uaType: that.state.uaType,
                    authorUid: that.state.authorUid,
                    from: $($('.calendar')[0]).val(),
                    to: $($('.calendar')[1]).val(),
                    start: start
                },
                dataType: 'json',
                success: function (data) {
                    if (data && data.realDataList && data.realDataList.length >= 0) {
                        that.setState({
                            realDataList: data.realDataList,
                            baseUrl: data.baseUrl
                        })
                    }
                }
            })
        }else{
            $.ajax({
                url: '/qun-audit/ajax/real/search-by-status',
                type: 'get',
                data: {
                    targetId: that.state.targetId,
                    type: that.state.selectType,
                    uaType: that.state.uaType,
                    authorUid: that.state.authorUid,
                    from: $($('.calendar')[0]).val(),
                    to: $($('.calendar')[1]).val(),
                    start: start,
                    status: that.state.status,
                    lastId: that.state.lastId,
                    firstId: that.state.firstId
                },
                dataType: 'json',
                success: function (data) {
                    if (data && data.realDataList && data.realDataList.length >= 0 ) {
                        that.setState({
                            realDataList: data.realDataList,
                            baseUrl: data.baseUrl,
                            retCode:data.retCode
                        }/!*,()=>{
                            $('#pageBtn').css("display","block");
                        }*!/)
                    }/!*else if( data && data.realDataList && data.realDataList.length <= 10 && data.realDataList.length >= 0){
                        that.setState({
                            realDataList: data.realDataList,
                            baseUrl: data.baseUrl,
                            retCode:data.retCode
                        },()=>{
                            $('#pageBtn').css("display","none");
                        })
                    }*!/
                }
            })
        }
    }
    // 初始化分页组件
    initPaging(len) {
        let that = this;
        $('#paging').twbsPagination('destroy');
        $('#paging').twbsPagination({
            totalPages: Math.ceil(len / that.pageLen),
            startPage: 1,
            visiblePages: 5,
            hideOnlyOnePage: true,
            first: '首页',
            prev: '上一页',
            next: '下一页',
            last: '末页',
            onPageClick: function (evt, page) {
                // 每页发请求
                that.clickSearch((page - 1) * 10)
            }
        })
    }
    clickPageButton(pageType){
        let that = this;
        $.ajax({
            url: '/qun-audit/ajax/real/search-by-status',
            type: 'get',
            data: {
                targetId: that.state.targetId,
                type: that.state.selectType,
                uaType: that.state.uaType,
                authorUid: that.state.authorUid,
                from: $($('.calendar')[0]).val(),
                to: $($('.calendar')[1]).val(),
                status: that.state.status,
                lastId: that.state.lastId,
                firstId: that.state.firstId
            },
            dataType: 'json',
            success: function (data) {
                if (data && data.realDataList && data.realDataList.length >= 0) {
                    that.setState({
                        realDataList: data.realDataList,
                        baseUrl: data.baseUrl,
                        retCode:data.retCode
                    },() => {
                        if(pageType == 1){
                            that.clickSearch(data.lastId);
                        }else if(pageType == 2){
                            that.clickSearch(data.firstId);
                        }

                    })
                }
            }
        })
    }

    componentDidMount() {
        let that = this;

        $($('.replace')[0]).replaceWith(`
        <input type="text" id="date-start" readonly
               onfocus="this.blur();WdatePicker({skin:'whyGreen',isShowClear:false,dateFmt:'yyyy-MM-dd',minDate: '2017-01-01', maxDate:'%y-%M-{%d}',onpicked:function() {
                 PubSub.publish('refreshData')
               }})" class="form-control search-time calendar Wdate" style="width: 186px;height: 33px;"/>
    `);

        $($('.replace')[0]).replaceWith(`
      <input type="text" id="date-end" readonly
               onfocus="this.blur();WdatePicker({skin:'whyGreen',isShowClear:false,dateFmt:'yyyy-MM-dd',minDate: '2017-01-01', maxDate:'%y-%M-{%d}',onpicked:function() {
                 PubSub.publish('refreshData')
               }})" class="form-control search-time calendar Wdate" style="width: 186px;height: 33px;"/>
    `);

        const start = getDiffDate(-7);
        const end = getDiffDate(0);

        $($('.calendar')[0]).val(start);
        $($('.calendar')[1]).val(end);

        that.getCounts(0);

        PubSub.subscribe('refreshData', () => {
            that.getCounts(0);
        })
    }

    render() {
        return (
            <div>
                <form className="am-form-inline" name="timeselect">
                    {/!*状态*!/}
                    <div className="am-form-group am-form-select" style={{visibility:this.state.visibility}} value={this.state.status}
                         onChange={this.changeStatus.bind(this)}>
                        <select name="type" style={{width: "80px", height: "37px"}} value={this.state.status}
                        >
                            <option value="1">空点赞</option>
                            <option value="2">空回答</option>
                            <option value="3">求点赞</option>
                            <option value="4">求互动</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    {/!*选择状态*!/}
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "80px", height: "37px"}} value={this.state.selectState}
                                onChange={this.changeState.bind(this)}>
                            <option value="n">无状态</option>
                            <option value="y">有状态</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "100px", height: "37px"}} value={this.state.selectType}
                                onChange={this.changeType.bind(this)}>
                            <option value="0">全部</option>
                            <option value="1">提问</option>
                            <option value="2">回答</option>
                            <option value="3">文章</option>
                            <option value="4">PK</option>
                            <option value="5">投票</option>
                            <option value="102">回答评论</option>
                            <option value="103">文章评论</option>
                            <option value="111">影评评论</option>
                            <option value="112">留星语评论</option>
                            <option value="113">书评评论</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "100px", height: "37px"}} value={this.state.uaType}
                                onChange={this.changeUaType.bind(this)}>
                            <option value={-1}>全部来源</option>
                            <option value={253}>PC</option>
                            <option value={254}>WAP</option>
                            <option value={255}>APP</option>
                            <option value={0}>未知来源</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <input type="text" name="targetId" className="am-form-field am-radius" placeholder="请输入targetId"
                           value={this.state.targetId} onInput={this.changeTarget.bind(this)}/>
                    <input type="text" name="authorUid" className="am-form-field am-radius" placeholder="请输入作者ID"
                           value={this.state.authorUid} onInput={this.changeAuthor.bind(this)}/>
                    <div className="am-form-group am-form-icon">
                        <div className="replace"></div>
                        <span className="am-icon-calendar"></span>
                    </div>
                    <div className="am-form-group am-form-icon">
                        <div className="replace"></div>
                        <span className="am-icon-calendar"></span>
                    </div>
                    <button className="am-btn am-btn-default am-radius" onClick={(event) => {
                        // 阻止form表单的默认行为 防止跳转页面 很重要
                        event.stopPropagation();
                        event.preventDefault();
                        this.getCounts();
                    }}>查询
                    </button>
                </form>

                <div className="am-scrollable-horizontal">
                    {this.state.realDataList && this.state.realDataList.length > 0 ?
                        <table className="am-table am-table-bordered am-text-nowrap"
                               style={{width: "auto", marginTop: '20px', marginLeft: "auto", marginRight: 'auto'}}>
                            <thead>
                            <tr>
                                <th>类型 | 来源</th>
                                <th colSpan="2">用户信息</th>
                                <th>时间</th>
                                <th>内容</th>
                                <th>PV</th>
                                <th>点赞</th>
                                <th>回答/评论</th>
                                <th colSpan="2">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.realDataList.map((item, index) => {
                                return <SingleItem data={item} key={item.id} baseUrl={this.state.baseUrl}/>
                            })}
                            </tbody>
                        </table> : <p>暂无内容</p>
                    }
                </div>
                <div id="paging"></div>
                {this.state.selectState == 'n' ? null : <ul style={{margin: "0 auto",width: "140px"}} id="pageBtn" class="pagination">
                    <li style={{"list-style":"none"}} class="page-item"><a href="#" style={{border:"1px solid #ddd",float: "left","margin":"0 10px 20px 0"}} class="page-link" onClick={()=>this.clickPageButton(2)}>上一页</a></li>
                    <li style={{"list-style":"none"}} class="page-item"><a href="#" style={{border:"1px solid #ddd",float: "left"}} class="page-link" onClick={()=>this.clickPageButton(1)}>下一页</a></li>
                </ul>}
            </div>
        );
    }
}*/

//新增需求3.0           特殊情况上下页禁用 初步实现    待解决问题：接口重复请求导致start参数错误，点击  上一页  数据呈现 存在bug   (已解决问题 完成需求)
/*export default class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visibility: 'hidden',//显示与隐藏
            selectState: 'n',//选择有无状态

            status: 1,   //四种状态的参数  new

            selectType: 0,  //type 类型 old
            targetId: '',   //输入框1  目标ID   old
            authorUid: '',  //输入框2 作者ID   old
            uaType: -1,     //来源  默认为-1表示全部  old

            retCode: 0,
            pageType: 1,
            lastId: 0,
            firstId: 0,

            initNum: 0,//new start

            totalNum: 0,

            realDataList: [],
            baseUrl: ''

        };
        this.pageLen = 10;
    }
    //四种状态
    changeStatus(event) {
        let that = this;
        this.setState(
            {status: event.target.value},
            () => {
                that.getCounts(0)
            }
        );
    }
    //有无状态
    changeState(event) {
        let that = this;
        this.setState(
            {selectState: event.target.value , visibility:this.state.visibility == 'hidden' ? 'visible' : 'hidden'},
            () => {
                $('#paging').twbsPagination('destroy');
                that.getCounts(0)
            }
        );
    }
    //选择类型
    changeType(event) {
        let that = this;
        this.setState({selectType: event.target.value}, () => {
            that.getCounts(0)
        })
    }
    //选择来源
    changeUaType(event) {
        let that = this;
        that.setState({uaType: event.target.value}, () => {
            that.getCounts(0);
        })

    }
    //目标ID
    changeTarget(event) {
        let that = this;
        this.setState({targetId: event.target.value}, () => {
            if (that.state.targetId.length == 0) {
                that.getCounts(0)
            }
        })
    }
    //作者ID
    changeAuthor(event) {
        let that = this;
        this.setState({authorUid: event.target.value}, () => {
            if (that.state.authorUid.length == 0) {
                that.getCounts(0)
            }
        })
    }

    getCounts(start) {
        let that = this;
        if(this.state.visibility == "hidden"){
            $.ajax({
                url: '/qun-audit/ajax/real/search/total',
                type: 'get',
                data: {
                    targetId: that.state.targetId,
                    type: that.state.selectType,
                    uaType: that.state.uaType,
                    authorUid: that.state.authorUid,
                    from: $($('.calendar')[0]).val(),
                    to: $($('.calendar')[1]).val(),
                    start: start
                },
                dataType: 'json',
                success: function (data) {
                    if (data && data.total) {
                        that.setState({totalNum: data.total}, () => {
                            if (that.state.totalNum > 0) {
                                that.initPaging(that.state.totalNum);
                            } else if (that.state.totalNum == 0) {
                                $('#paging').twbsPagination('destroy')
                            }
                        })
                    } else {
                        that.setState({totalNum: 0, realDataList: []}, () => {
                            $('#paging').twbsPagination('destroy')
                        })
                    }
                }
            })
        }else if(this.state.visibility == "visible"){
            $.ajax({
                url: '/qun-audit/ajax/real/search-by-status',
                type: 'get',
                data: {
                    targetId: that.state.targetId,
                    type: that.state.selectType,
                    uaType: that.state.uaType,
                    authorUid: that.state.authorUid,
                    from: $($('.calendar')[0]).val(),
                    to: $($('.calendar')[1]).val(),
                    start: start,
                    status: that.state.status,
                    pageType: that.state.pageType
                },
                dataType: 'json',
                success: function (data) {
                    if (data && (data.retCode == 0)) {
                        that.setState({retCode: data.retCode,realDataList:data.realDataList,firstId:data.firstId,lastId:data.lastId})
                    } else {
                        that.setState({retCode: data.retCode , realDataList: []});
                    }
                }
            })
        }

    }
    // 请求数据
    clickSearch(start) { // flag参数标识是否需要重置分页组件 true需要 false不需要
        let that = this;
        if(this.state.visibility == 'hidden'){
            $.ajax({
                url: '/qun-audit/ajax/real/search',
                type: 'get',
                data: {
                    targetId: that.state.targetId,
                    type: that.state.selectType,
                    uaType: that.state.uaType,
                    authorUid: that.state.authorUid,
                    from: $($('.calendar')[0]).val(),
                    to: $($('.calendar')[1]).val(),
                    start: start
                },
                dataType: 'json',
                success: function (data) {
                    if (data && data.realDataList && data.realDataList.length >= 0) {
                        that.setState({
                            realDataList: data.realDataList,
                            baseUrl: data.baseUrl
                        })
                    }
                }
            })
        }else{
            $.ajax({
                url: '/qun-audit/ajax/real/search-by-status',
                type: 'get',
                data: {
                    targetId: that.state.targetId,
                    type: that.state.selectType,
                    uaType: that.state.uaType,
                    authorUid: that.state.authorUid,
                    from: $($('.calendar')[0]).val(),
                    to: $($('.calendar')[1]).val(),
                    start: start,
                    status: that.state.status,
                    pageType: that.state.pageType
                },
                dataType: 'json',
                success: function (data) {
                    if (data && data.realDataList && data.realDataList.length >= 0 ) {
                        that.setState({
                            realDataList: data.realDataList,
                            baseUrl: data.baseUrl
                        },()=>{
                            switch(start){
                                case 0:
                                    if(data.retCode == 0 ){
                                        $('#pageBtn2').css("visibility","hidden");
                                        alert("1.")
                                    }else{
                                        $('#pageBtn').css("visibility","hidden");
                                        alert("3.")
                                    }
                                    break;
                                default:
                                    if(data.retCode == 0){
                                        $('#pageBtn').css("visibility","visible");
                                        $('#pageBtn2').css("visibility","visible");
                                        $('#pageBtn1').css("visibility","visible");
                                        alert("2.")
                                    }else{
                                        $('#pageBtn').css("visibility","visible");
                                        $('#pageBtn2').css("visibility","visible");
                                        $('#pageBtn1').css("visibility","hidden");
                                        alert("4.")
                                    }
                            }
                        })
                    }
                }
            })
        }
    }
    // 请求数据
    clickSearch2(start) { // flag参数标识是否需要重置分页组件 true需要 false不需要
        let that = this;
        $.ajax({
                url: '/qun-audit/ajax/real/search-by-status',
                type: 'get',
                data: {
                    targetId: that.state.targetId,
                    type: that.state.selectType,
                    uaType: that.state.uaType,
                    authorUid: that.state.authorUid,
                    from: $($('.calendar')[0]).val(),
                    to: $($('.calendar')[1]).val(),
                    start: start,
                    status: that.state.status,
                    pageType: that.state.pageType
                },
                dataType: 'json',
                success: function (data) {
                    if (data && data.realDataList && data.realDataList.length >= 0 ) {
                        that.setState({
                            realDataList: data.realDataList,
                            baseUrl: data.baseUrl
                        },()=>{
                            switch(start){
                                case 0:
                                    if(data.retCode == 0 ){
                                        $('#pageBtn2').css("visibility","hidden");
                                        alert("1.")
                                    }else{
                                        $('#pageBtn').css("visibility","hidden");
                                        alert("3.")
                                    }
                                    break;
                                default:
                                    if(data.retCode == 0){
                                        $('#pageBtn').css("visibility","visible");
                                        $('#pageBtn2').css("visibility","visible");
                                        $('#pageBtn1').css("visibility","visible");
                                        alert("2.")
                                    }else{
                                        $('#pageBtn').css("visibility","visible");
                                        $('#pageBtn2').css("visibility","visible");
                                        $('#pageBtn1').css("visibility","hidden");
                                        alert("4.")
                                    }
                            }
                        })
                    }
                }
            })

    }

    // 初始化分页组件
    initPaging(len) {
        let that = this;
        $('#paging').twbsPagination('destroy');
        $('#paging').twbsPagination({
            totalPages: Math.ceil(len / that.pageLen),
            startPage: 1,
            visiblePages: 5,
            hideOnlyOnePage: true,
            first: '首页',
            prev: '上一页',
            next: '下一页',
            last: '末页',
            onPageClick: function (evt, page) {
                // 每页发请求
                that.clickSearch((page - 1) * 10)
            }
        })
    }

    clickPageButton(pageType){
        let that = this;
            $.ajax({
                url: '/qun-audit/ajax/real/search-by-status',
                type: 'get',
                data: {
                    targetId: that.state.targetId,
                    type: that.state.selectType,
                    uaType: that.state.uaType,
                    authorUid: that.state.authorUid,
                    from: $($('.calendar')[0]).val(),
                    to: $($('.calendar')[1]).val(),
                    status: that.state.status,
                    pageType: pageType,
                    start: pageType == 1 ? that.state.lastId : that.state.firstId
                },
                dataType: 'json',
                success: function (data) {

                    if (data && data.realDataList && data.realDataList.length >= 0) {
                        that.setState({
                            realDataList: data.realDataList,
                            baseUrl: data.baseUrl,
                            pageType: pageType,
                            firstId:data.firstId,
                            lastId:data.lastId
                        })
                    }
                }
            })
        }


    componentDidMount() {
        let that = this;

        $($('.replace')[0]).replaceWith(`
        <input type="text" id="date-start" readonly
               onfocus="this.blur();WdatePicker({skin:'whyGreen',isShowClear:false,dateFmt:'yyyy-MM-dd',minDate: '2017-01-01', maxDate:'%y-%M-{%d}',onpicked:function() {
                 PubSub.publish('refreshData')
               }})" class="form-control search-time calendar Wdate" style="width: 186px;height: 33px;"/>
    `);

        $($('.replace')[0]).replaceWith(`
      <input type="text" id="date-end" readonly
               onfocus="this.blur();WdatePicker({skin:'whyGreen',isShowClear:false,dateFmt:'yyyy-MM-dd',minDate: '2017-01-01', maxDate:'%y-%M-{%d}',onpicked:function() {
                 PubSub.publish('refreshData')
               }})" class="form-control search-time calendar Wdate" style="width: 186px;height: 33px;"/>
    `);

        const start = getDiffDate(-7);
        const end = getDiffDate(0);

        $($('.calendar')[0]).val(start);
        $($('.calendar')[1]).val(end);

        that.getCounts(0);

        PubSub.subscribe('refreshData', () => {
            that.getCounts(0);
        })
    }

    render() {
        return (
            <div>
                <form className="am-form-inline" name="timeselect">
                    {/!*状态*!/}
                    <div className="am-form-group am-form-select" style={{visibility:this.state.visibility}} value={this.state.status}
                         onChange={this.changeStatus.bind(this)}>
                        <select name="type" style={{width: "80px", height: "37px"}} value={this.state.status}
                        >
                            <option value="1">空点赞</option>
                            <option value="2">空回答</option>
                            <option value="3">求点赞</option>
                            <option value="4">求互动</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    {/!*选择状态*!/}
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "80px", height: "37px"}} value={this.state.selectState}
                                onChange={this.changeState.bind(this)}>
                            <option value="n">无状态</option>
                            <option value="y">有状态</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "100px", height: "37px"}} value={this.state.selectType}
                                onChange={this.changeType.bind(this)}>
                            <option value="0">全部</option>
                            <option value="1">提问</option>
                            <option value="2">回答</option>
                            <option value="3">文章</option>
                            <option value="4">PK</option>
                            <option value="5">投票</option>
                            <option value="102">回答评论</option>
                            <option value="103">文章评论</option>
                            <option value="111">影评评论</option>
                            <option value="112">留星语评论</option>
                            <option value="113">书评评论</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "100px", height: "37px"}} value={this.state.uaType}
                                onChange={this.changeUaType.bind(this)}>
                            <option value={-1}>全部来源</option>
                            <option value={253}>PC</option>
                            <option value={254}>WAP</option>
                            <option value={255}>APP</option>
                            <option value={0}>未知来源</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <input type="text" name="targetId" className="am-form-field am-radius" placeholder="请输入targetId"
                           value={this.state.targetId} onInput={this.changeTarget.bind(this)}/>
                    <input type="text" name="authorUid" className="am-form-field am-radius" placeholder="请输入作者ID"
                           value={this.state.authorUid} onInput={this.changeAuthor.bind(this)}/>
                    <div className="am-form-group am-form-icon">
                        <div className="replace"></div>
                        <span className="am-icon-calendar"></span>
                    </div>
                    <div className="am-form-group am-form-icon">
                        <div className="replace"></div>
                        <span className="am-icon-calendar"></span>
                    </div>
                    <button className="am-btn am-btn-default am-radius" onClick={(event) => {
                        // 阻止form表单的默认行为 防止跳转页面 很重要
                        event.stopPropagation();
                        event.preventDefault();
                        this.getCounts();
                    }}>查询
                    </button>
                </form>

                <div className="am-scrollable-horizontal">
                    {this.state.realDataList && this.state.realDataList.length > 0 ?
                        <table className="am-table am-table-bordered am-text-nowrap"
                               style={{width: "auto", marginTop: '20px', marginLeft: "auto", marginRight: 'auto'}}>
                            <thead>
                            <tr>
                                <th>类型 | 来源</th>
                                <th colSpan="2">用户信息</th>
                                <th>时间</th>
                                <th>内容</th>
                                <th>PV</th>
                                <th>点赞</th>
                                <th>回答/评论</th>
                                <th colSpan="2">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.realDataList.map((item, index) => {
                                return <SingleItem data={item} key={item.id} baseUrl={this.state.baseUrl}/>
                            })}
                            </tbody>
                        </table> : <p>暂无内容</p>
                    }
                </div>
                <div id="paging"></div>
                {this.state.selectState == 'n' ? null : <div id="pageBtn">
                    <button id="pageBtn2" name="2" onClick={()=>this.clickPageButton(2)}>上一页</button>
                    <button id="pageBtn1" name="1" onClick={()=>this.clickPageButton(1)}>下一页</button>
                </div>}
            </div>
        );
    }
}*/

//新增需求4.0           自己完成的需求 + 翻页按钮样式优化
export default class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visibility: 'hidden',//显示与隐藏
            selectState: 'n',//选择有无状态

            status: 1,   //四种状态的参数  new

            selectType: 0,  //type 类型 old
            targetId: '',   //输入框1  目标ID   old
            authorUid: '',  //输入框2 作者ID   old
            uaType: -1,     //来源  默认为-1表示全部  old

            lastId: 0,
            firstId: 0,
            pageType: 0,
            retCode: 0,

            totalNum: 0,

            realDataList: [],
            baseUrl: ''

        };
        this.pageLen = 10;
    }
    //四种状态
    changeStatus(event) {
        let that = this;
        this.setState(
            {status: event.target.value},
            () => {
                that.getCounts(0)
            }
        );
    }
    //有无状态
    changeState(event) {
        let that = this;
        this.setState(
            {selectState: event.target.value , visibility:this.state.visibility == 'hidden' ? 'visible' : 'hidden'},
            () => {
                $('#paging').twbsPagination('destroy');
                that.getCounts(0)
            }
        );
    }
    //选择类型
    changeType(event) {
        let that = this;
        this.setState({selectType: event.target.value}, () => {
            that.getCounts(0)
        })
    }
    //选择来源
    changeUaType(event) {
        let that = this;
        that.setState({uaType: event.target.value}, () => {
            that.getCounts(0);
        })

    }
    //目标ID
    changeTarget(event) {
        let that = this;
        this.setState({targetId: event.target.value}, () => {
            if (that.state.targetId.length == 0) {
                that.getCounts(0)
            }
        })
    }
    //作者ID
    changeAuthor(event) {
        let that = this;
        this.setState({authorUid: event.target.value}, () => {
            if (that.state.authorUid.length == 0) {
                that.getCounts(0)
            }
        })
    }

    getCounts(start) {
        let that = this;
        if(this.state.visibility == "hidden"){
            $.ajax({
                url: '/qun-audit/ajax/real/search/total',
                type: 'get',
                data: {
                    targetId: that.state.targetId,
                    type: that.state.selectType,
                    uaType: that.state.uaType,
                    authorUid: that.state.authorUid,
                    from: $($('.calendar')[0]).val(),
                    to: $($('.calendar')[1]).val(),
                    start: start
                },
                dataType: 'json',
                success: function (data) {
                    if (data && data.total) {
                        that.setState({totalNum: data.total}, () => {
                            if (that.state.totalNum > 0) {
                                that.initPaging(that.state.totalNum);
                            } else if (that.state.totalNum == 0) {
                                $('#paging').twbsPagination('destroy')
                            }
                        })
                    } else {
                        that.setState({totalNum: 0, realDataList: []}, () => {
                            $('#paging').twbsPagination('destroy')
                        })
                    }
                }
            })
        }else if(this.state.visibility == "visible"){
            $.ajax({
                url: '/qun-audit/ajax/real/search-by-status',
                type: 'get',
                data: {
                    targetId: that.state.targetId,
                    type: that.state.selectType,
                    uaType: that.state.uaType,
                    authorUid: that.state.authorUid,
                    from: $($('.calendar')[0]).val(),
                    to: $($('.calendar')[1]).val(),
                    start: start,
                    status: that.state.status
                },
                dataType: 'json',
                success: function (data) {
                    if (data && data.retCode == 0) {
                        that.setState({
                            realDataList: data.realDataList,
                            baseUrl: data.baseUrl,
                            lastId: data.lastId,
                            firstId: data.firstId,
                            retCode: data.retCode
                        })
                    } else {
                        that.setState({ retCode: data.retCode , realDataList: []});
                    }
                }
            })
        }

    }

    //无状态请求数据
    clickSearch(start) { // flag参数标识是否需要重置分页组件 true需要 false不需要
        let that = this;
        $.ajax({
                url: '/qun-audit/ajax/real/search',
                type: 'get',
                data: {
                    targetId: that.state.targetId,
                    type: that.state.selectType,
                    uaType: that.state.uaType,
                    authorUid: that.state.authorUid,
                    from: $($('.calendar')[0]).val(),
                    to: $($('.calendar')[1]).val(),
                    start: start
                },
                dataType: 'json',
                success: function (data) {
                    if (data && data.realDataList && data.realDataList.length >= 0) {
                        that.setState({
                            realDataList: data.realDataList,
                            baseUrl: data.baseUrl,
                            lastId: data.lastId,
                            firstId: data.firstId,
                            retCode: data.retCode
                        })
                    }
                }
            })
    }

    // 初始化分页组件
    initPaging(len) {
        let that = this;
        $('#paging').twbsPagination('destroy');
        $('#paging').twbsPagination({
            totalPages: Math.ceil(len / that.pageLen),
            startPage: 1,
            visiblePages: 5,
            hideOnlyOnePage: true,
            first: '首页',
            prev: '上一页',
            next: '下一页',
            last: '末页',
            onPageClick: function (evt, page) {
                // 每页发请求
                that.clickSearch((page - 1) * 10)
            }
        })
    }

    clickPageButton(pageType){
        let that = this;
        //下一页 lastId
        $.ajax({
            url: '/qun-audit/ajax/real/search-by-status',
            type: 'get',
            data: {
                targetId: that.state.targetId,
                type: that.state.selectType,
                uaType: that.state.uaType,
                authorUid: that.state.authorUid,
                from: $($('.calendar')[0]).val(),
                to: $($('.calendar')[1]).val(),
                start: pageType == 1 ? that.state.lastId : that.state.firstId ,
                status: that.state.status,
                pageType: pageType
            },
            dataType: 'json',
            success: function (data) {
                if (data && data.realDataList && data.realDataList.length >= 0) {
                    that.setState({
                        realDataList: data.realDataList,
                        baseUrl: data.baseUrl,
                        lastId: data.lastId,
                        firstId: data.firstId,
                        retCode: data.retCode
                    })
                }
            }
        })
    }

    componentDidMount() {
        let that = this;

        $($('.replace')[0]).replaceWith(`
        <input type="text" id="date-start" readonly
               onfocus="this.blur();WdatePicker({skin:'whyGreen',isShowClear:false,dateFmt:'yyyy-MM-dd',minDate: '2017-01-01', maxDate:'%y-%M-{%d}',onpicked:function() {
                 PubSub.publish('refreshData')
               }})" class="form-control search-time calendar Wdate" style="width: 186px;height: 33px;"/>
    `);

        $($('.replace')[0]).replaceWith(`
      <input type="text" id="date-end" readonly
               onfocus="this.blur();WdatePicker({skin:'whyGreen',isShowClear:false,dateFmt:'yyyy-MM-dd',minDate: '2017-01-01', maxDate:'%y-%M-{%d}',onpicked:function() {
                 PubSub.publish('refreshData')
               }})" class="form-control search-time calendar Wdate" style="width: 186px;height: 33px;"/>
    `);

        const start = getDiffDate(-7);
        const end = getDiffDate(0);

        $($('.calendar')[0]).val(start);
        $($('.calendar')[1]).val(end);

        that.getCounts(0);

        PubSub.subscribe('refreshData', () => {
            that.getCounts(0);
        })
    }

    render() {
        return (
            <div>
                <form className="am-form-inline" name="timeselect">
                    {/*状态*/}
                    <div className="am-form-group am-form-select" style={{visibility:this.state.visibility}} value={this.state.status}
                         onChange={this.changeStatus.bind(this)}>
                        <select name="type" style={{width: "80px", height: "37px"}} value={this.state.status}
                        >
                            <option value="1">空点赞</option>
                            <option value="2">空回答</option>
                            <option value="3">求点赞</option>
                            <option value="4">求互动</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    {/*选择状态*/}
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "80px", height: "37px"}} value={this.state.selectState}
                                onChange={this.changeState.bind(this)}>
                            <option value="n">无状态</option>
                            <option value="y">有状态</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "100px", height: "37px"}} value={this.state.selectType}
                                onChange={this.changeType.bind(this)}>
                            <option value="0">全部</option>
                            <option value="1">提问</option>
                            <option value="2">回答</option>
                            <option value="3">文章</option>
                            <option value="4">PK</option>
                            <option value="5">投票</option>
                            <option value="102">回答评论</option>
                            <option value="103">文章评论</option>
                            <option value="111">影评评论</option>
                            <option value="112">留星语评论</option>
                            <option value="113">书评评论</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <div className="am-form-group am-form-select">
                        <select name="type" style={{width: "100px", height: "37px"}} value={this.state.uaType}
                                onChange={this.changeUaType.bind(this)}>
                            <option value={-1}>全部来源</option>
                            <option value={253}>PC</option>
                            <option value={254}>WAP</option>
                            <option value={255}>APP</option>
                            <option value={0}>未知来源</option>
                        </select>
                        <span className="am-form-caret"></span>
                    </div>
                    <input type="text" name="targetId" className="am-form-field am-radius" placeholder="请输入targetId"
                           value={this.state.targetId} onChange={this.changeTarget.bind(this)}/>
                    <input type="text" name="authorUid" className="am-form-field am-radius" placeholder="请输入作者ID"
                           value={this.state.authorUid} onChange={this.changeAuthor.bind(this)}/>
                    <div className="am-form-group am-form-icon">
                        <div className="replace"></div>
                        <span className="am-icon-calendar"></span>
                    </div>
                    <div className="am-form-group am-form-icon">
                        <div className="replace"></div>
                        <span className="am-icon-calendar"></span>
                    </div>
                    <button className="am-btn am-btn-default am-radius" onClick={(event) => {
                        // 阻止form表单的默认行为 防止跳转页面 很重要
                        event.stopPropagation();
                        event.preventDefault();
                        this.getCounts();
                    }}>查询
                    </button>
                </form>

                <div className="am-scrollable-horizontal">
                    {this.state.realDataList && this.state.realDataList.length > 0 ?
                        <table className="am-table am-table-bordered am-text-nowrap"
                               style={{width: "auto", marginTop: '20px', marginLeft: "auto", marginRight: 'auto'}}>
                            <thead>
                            <tr>
                                <th>类型 | 来源</th>
                                <th colSpan="2">用户信息</th>
                                <th>时间</th>
                                <th>内容</th>
                                <th>PV</th>
                                <th>点赞</th>
                                <th>回答/评论</th>
                                <th colSpan="2">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.realDataList.map((item, index) => {
                                return <SingleItem data={item} key={item.id} baseUrl={this.state.baseUrl}/>
                            })}
                            </tbody>
                        </table> : <p>暂无内容</p>
                    }
                </div>
                <div id="paging"></div>
                {this.state.selectState == 'n' ? null : <ul id="pageBtn" className="pagination">
                    <li className="page-item"><a href="#" className="page-link" onClick={()=>this.clickPageButton(2)}>上一页</a></li>
                    <li className="page-item"><a href="#" className="page-link" onClick={()=>this.clickPageButton(1)}>下一页</a></li>
                </ul>}
            </div>
        );
    }
}
