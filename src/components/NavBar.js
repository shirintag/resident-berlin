var React = require('react');

var NavBar = React.createClass({
  render: function () {
    var pages = ['about', 'contact', 'login'];
    var navLinks = pages.map(function(page){
      return (
        <button className="btn btn-link"><a href={'/' + page}> {page}</a></button>
      );
    });
    return <nav>{navLinks}</nav>;
  }
});

module.exports = NavBar;
