import React, { Component } from 'react';
import WordCloud from 'react-d3-cloud';

class Post extends Component {
    
    constructor(props) {
        super(props);
        this.WordMap=[];
        this.state = {
            value: this.props.value,
            showComponent: false,
            title: '',
            postid: '',
            source: '',
            image: {},
            comments: [],
            WordMap: []
        }
        this.updateWordMap = this.updateWordMap.bind(this)
    }
    componentWillMount() {
        this.getImages();
    }
    componentDidMount() {
        setInterval(() => {
            this.forceUpdate();
        }, 3000);
    }
    updateWordMap() {
        if (this.state.comments !== '') {
            for (var i = 0; i < 5; i++) {
                if (this.state.comments[i] in this.WordMap) {
                   
                }
                else {
                    var temp = {
                        text: this.state.comments[i],
                        value: 1000
                    }
                    this.WordMap.push(temp);
                }
            }
            console.log(this.WordMap)
        }
        this.forceUpdate();
    }
    getImages(index) {

        let request = 'https://www.reddit.com/r/' + this.state.value + '/top/.json?limit=1'
        fetch(request)
            .then((response) => {
                return response.json();
            }).then((data) => {
                this.setState({
                    postid: data.data.children[0].data.id,
                    image: data.data.children[0].data.preview.images[0].source.url,
                    title: data.data.children[0].data.title,
                    source: data.data.children[0].data.preview.images[0].source.url
                },
                    function () {
                        this.readComments();

                    });
            });

    }

    printNode(node) {
        if (node.body !== undefined) {
            var ch = node.body;

            if (typeof ch === "string" && /[A-Za-z]/.test(ch)) {
                var array = ch.split(" ")
                for (var i = 0; i < array.length; i++) {
                    this.state.comments.push(array[i]);

                }

            }
        }
    }
    readComments() {
        let request = 'https://www.reddit.com/r/' + this.state.value + '/comments/' + this.state.postid + '/.json?'
        fetch(request)
            .then((response) => {
                return response.json();
            }).then((data) => {

                if (data[1] !== undefined) {
                    for (let i = 0; i < data[1].data.children.length; i++) {
                        this.printNode(data[1].data.children[i].data);
                    }
                }

            });

    }
    render() {
        const fontSizeMapper = word => Math.log2(word.value) * 10;
        const rotate = word => word.value % 360;

        var cardStyle = {

            margin: 'auto',
            width: 700,
            height: 600
        };
        var intervalID;
        function changeimg() {
            // Your code here
            intervalID = setInterval(update, 1000);

        }
        function update() {
            //this.updateImages();
            stop();
        }
        function stop() {
            clearInterval(intervalID);
        }
        return (

            <div className="rPost">
                <div className="card" >
                    <h5 className="card-title">{this.state.title}</h5>
                    <a href={this.state.source}>
                        <img className="card-img-top" src={this.state.image} style={cardStyle} alt=""></img></a>
                    <div className="card-body">
                        <WordCloud
                            data={this.WordMap}
                            fontSizeMapper={fontSizeMapper}
                            rotate={rotate}
                        />,
                        <button className="btn btn-primary" onClick={this.updateWordMap}>View suggested comments</button>
                    </div>
                </div>
            </div>
        );
    }
}
export default Post;
