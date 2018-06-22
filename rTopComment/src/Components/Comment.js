import React, { Component } from 'react';
import WordCloud from 'react-d3-cloud';
class Comment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            showComponent: false,
            title: '',
            postid: '',
            source: '',
            image: {},
            comments: [],
            WordMap: [{ text: 'Hey', value: 1000 },
            { text: 'lol', value: 200 },
            { text: 'first impression', value: 800 },
            { text: 'very cool', value: 1000000 },
            { text: 'duck', value: 10 },]
        }

    }
    componentWillMount() {

        this.getImages();

    }
    componentDidMount() {

        var timer = setInterval(() => {
            this.forceUpdate();
            if (this.state.comments !== undefined) {
                this.updateWordMap();
                console.log("WordMap updated");
                clearInterval(timer);
                setInterval(() => {
                    this.forceUpdate();
                }, 3000);
            }

        }, 3000);

    }
    updateWordMap() {
        if (this.state.comments !== '') {
            for (var i = 0; i < this.state.comments.length; i++) {
                console.log("Entered loop");
                if (this.state.comments[i] in this.state.WordMap) {

                }
                else {
                    var temp = {
                        text: this.state.comments[i],
                        value: 1
                    }
                    this.state.WordMap.push(temp);
                }
            }
            console.log(this.state.WordMap)
        }
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



        const fontSizeMapper = word => Math.log2(word.value) * 5;
        const rotate = word => word.value % 360;

        var p = this.state.postid;

        var cardStyle = {

            margin: 'auto',
            width: 300,
            height: 300,

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

            <div className="rComment">
               
            </div>
        );
    }
}
export default Comment;
