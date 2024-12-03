//Class to Handle  error
class ExpressError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
}
module.exports = ExpressError;


// <!-- use this lines in error.ejs file  to see the error stack -->
//Just replace the error.ejs's div

// <div class="alert alert-danger" role="alert">
// <h4 class="alert-heading">
//     <%= err.stack %>
// </h4>
// </div>
