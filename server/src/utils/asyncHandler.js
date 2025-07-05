export const asyncHandler = (reqHandler) => {
  return (req, res, next) => {
    Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err));
  };
};
// asyncHandler	         -------	Async controller ke errors ko safely handle karta hai
// Promise.resolve()	 -------	Ensure karta hai ke async function promise ban jaaye
// catch(next)	         -------	Error ko middleware tak le jaata hai
// Without it	         -------	App crash ho sakti hai if await fails
