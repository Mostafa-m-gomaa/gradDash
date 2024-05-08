import { Link } from "react-router-dom";

const RequestItem = ({
  item,
  index,
  clickAssign,
  acceptRequest,
  isEmployerView,
}) => {
  console.log(item);
  return (
    <div className="request">
      <h2>request {index + 1}</h2>
      <div>type : {item.title}</div>
      <div>state : {item.Eligibility}</div>
      <div>current Step : {item.currentStep}</div>
      <div>Client username : {item.UserDetails?.username}</div>
      <div>Client email : {item.UserDetails?.email}</div>
      {!isEmployerView && (
        <>
          {item.employeeId ? (
            <>
              <div>Employee username : {item.Employee?.username}</div>
              <div>Employee email : {item.Employee?.email}</div>
            </>
          ) : (
            <div> request not assigned </div>
          )}
        </>
      )}
      <Link to={`/request/${item.title}/${item.id}`}>view request </Link>

      {isEmployerView ? (
        <>
          <Link to={`/request-progress/${item.title}/${item.id}`}>
            Request Progress
          </Link>
        </>
      ) : (
        <>
          {item.Eligibility === "eligible" ? null : (
            <button onClick={() => acceptRequest(item.title, item.id)}>
              Accept
            </button>
          )}
          {item.Eligibility === "pending" ? null : (
            <button
              onClick={() =>
                clickAssign(item.id, item.UserId, item?.employeeId)
              }
            >
              Assign to emp
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default RequestItem;
