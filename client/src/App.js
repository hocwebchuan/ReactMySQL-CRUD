import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      news: [],
      id: '',
      title: '',
      description: '',
      content: ''
    }
  };

  componentDidMount() {
    axios.get('/api/news')
      .then(res => {
        const news = res.data;
        this.setState({ news: news.news });
      })
      .catch(error => console.log(error));
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  handleInsertSubmit = (event) => {
    event.preventDefault();

    const newItem = {
      id: '',
      title: this.state.title,
      description: this.state.description,
      content: this.state.content
    };

    axios.post('/api/insert', newItem)
      .then(res => {
        let news = this.state.news;
        news = [newItem,...news];
        this.setState({ news: news });
      })
      .catch(error => console.log(error));
  };

  componentWillMount() {
    Modal.setAppElement('body');
  };

  openModal = (item) => {
    this.setState({
      modalIsOpen: true,
      id: item.id,
      title: item.title,
      description: item.description,
      content: item.content
    });
  };

  closeModal = () => {
    this.setState({
      modalIsOpen: false
    });
  };

  handleEditSubmit = (event) => {
    event.preventDefault();

    const newUpdate = {
      id: this.state.id,
      title: this.state.title,
      description: this.state.description,
      content: this.state.content
    };

    axios.post('/api/edit', newUpdate)
    .then(res => {
      let key = this.state.id;
      this.setState(prevState => ({
        news: prevState.news.map(
          elm => elm.id === key? {
            ...elm,
            title: this.state.title,
            description: this.state.description,
            content: this.state.content
          }: elm
        )
      }))
    })
    .catch(error => console.log(error));
  };

  handleDelete = (item) => {
    const newsId = {
        id: item.id
    };

    axios.post('/api/delete', newsId)
    .then(res => {
      this.setState(prevState => ({
        news: prevState.news.filter(el => el.id !== item.id )
      }));
    })
    .catch(error => console.log(error));
  };

  render() {
    return(
      <div>
        <h2>Add an item</h2>
        <form onSubmit={this.handleInsertSubmit}>
          <table>
            <tbody>
              <tr>
                <th><label>Title</label></th>
                <td>
                  <input
                    name="title"
                    type="text"
                    onChange={this.handleInputChange} />
                </td>
              </tr>

              <tr>
                <th><label>Description</label></th>
                <td>
                  <textarea
                    name="description"
                    onChange={this.handleInputChange} />
                </td>
              </tr>

              <tr>
                <th><label>Content</label></th>
                <td>
                  <textarea
                    name="content"
                    onChange={this.handleInputChange} />
                </td>
              </tr>
            </tbody>
          </table>

          <button type="submit">Submit</button>
        </form>

        <hr />

        <ul>
          {this.state.news.map(item => (
            <li key={item.id}>
              <h2>{item.title}</h2>
              <div>{item.description}</div>
               <button onClick={() => this.openModal(item)}>Edit</button>
               <button onClick={() => this.handleDelete(item)}>Delete</button>
            </li>
          ))}
        </ul>

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}>
          <button onClick={this.closeModal}>Close</button>
          <form onSubmit={this.handleEditSubmit}>
            <table>
              <tbody>
                <tr>
                  <th><label>Title</label></th>
                  <td>
                    <input
                      type="text"
                      name="title"
                      value={this.state.title} 
                      onChange={this.handleInputChange} />
                  </td>
                </tr>

                <tr>
                  <th><label>Description</label></th>
                  <td>
                    <textarea
                      name="description"
                      value={this.state.description} 
                      onChange={this.handleInputChange} />
                  </td>
                </tr>

                <tr>
                  <th><label>Content</label></th>
                  <td>
                    <textarea
                      name="content"
                      value={this.state.content} 
                      onChange={this.handleInputChange} />
                  </td>
                </tr>
              </tbody>
            </table>
            <button type="submit">Edit</button>
          </form>
        </Modal>
      </div>
    )
  }
};

export default App;