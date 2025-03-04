## Express Handler Async

**Overview**
- Middleware designed to manage exceptions within asynchronous Express routes, forwarding them to your Express error handlers.

**Features**
- Automatically catches exceptions thrown by asynchronous Express routes.
- Forwards exceptions to your Express error handlers.
- Supports both synchronous and asynchronous error handlers.
- Supports both Express 4.x and 5.x.
- Lightweight and easy to use.
- No dependencies.
- Written in TypeScript.
- Fully typed.
- Open-source.


**Installation**
```bash
npm install express-handler-async
```

**Usage**
- Import the asyncHandler function from the express-handler-async package.
- Wrap your asynchronous Express route handlers with the asyncHandler function.
- The asyncHandler function will automatically catch exceptions thrown by your asynchronous route handlers and forward them to your Express error handlers.


```javascript
import asyncHandler from 'express-handler-async';

// express route example
app.get('/example', asyncHandler(async (req, res) => {
    const result = await someAsyncFunction();
    res.json(result);
}));
```

```javascript
// without asyncHandler
app.get('/example', async (req, res, next) => {
    try {
        const result = await someAsyncFunction();
        res.json(result);
    } catch (error) {
        next(error);
    }
});
```