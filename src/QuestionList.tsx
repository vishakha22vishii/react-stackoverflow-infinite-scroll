import React from 'react';
import { List, message, PageHeader, Spin, Avatar, Modal } from 'antd';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';


class QuestionList extends React.Component<{}, { data: any,loading: boolean, hasMore: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            hasMore: true,
        };
    }
    
    componentDidMount = () => {
        this.fetchData();
    }

    fetchData = () => {
      let { data } = this.state;
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const url = "http://api.stackexchange.com/2.2/questions?site=stackoverflow&tagged=javascript"; // site that doesn’t send Access-Control-*
      axios.get(proxyurl + url)
      .then(res => {
          data = data.concat(res.data.items);
          this.setState({data, loading: false, hasMore: res.data.has_more});
      }).catch(error => {
        console.log(error);
        this.setState({loading: false});
      });     
    };

    handleInfiniteOnLoad = () => {
      if (!this.state.hasMore) {
        message.warning('Infinite List loaded all');
        this.setState({
          hasMore: false,
          loading: false,
        });
        return;
      }
      this.fetchData();
      };
    
    getHumanReadableDate = (date: number) => {
      let creationDate = new Date( date *1000);
      return creationDate.toLocaleString();
    }

    getQuestionInfo = (title: string, link: string) => {
      Modal.info({
        title: title,
        content: <a href={link} target="_blank">{link}</a>,
        onOk() {},
      });
    }

    render() {
        return (
          <React.Fragment>
            <PageHeader
              style={{
                border: '1px solid rgb(235, 237, 240)',
              }}
              onBack={() => null}
              title="QuestList"
              subTitle="List of StackOverFlow Questions. Click on the Question to know more about it."
            />
            <div className="demo-infinite-container">
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={!this.state.loading && this.state.hasMore}
                useWindow={false}
              >
                <List
                  dataSource={this.state.data}
                  renderItem={(item:any) => (
                    <List.Item key={item.id}>
                      <List.Item.Meta
                        avatar={
                          <Avatar src={item.owner.profile_image || 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'} />
                        }
                        title={item.owner.display_name}
                        description={<div style={{cursor: 'pointer'}} onClick={() => this.getQuestionInfo(item.title, item.link)}>{item.title}</div>}
                      />
                      <div><p>Created on:</p>{this.getHumanReadableDate(item.creation_date)}</div>
                    </List.Item>
                  )}
                >
                  {this.state.loading && this.state.hasMore && (
                    <div className="demo-loading-container">
                      <Spin />
                    </div>
                  )}
                </List>
              </InfiniteScroll>
            </div>
          </React.Fragment>
        );
      }
}
export default QuestionList;