import "./Dashboard.footer.css";

const DashboardFooter = () => {
  return (
    <div className="dashboard__footer">
      <section className="dashboard__footer__section__one"></section>
      <section className="dashboard__footer__section__two">
        <p>&copy; Copyright Easycoop {new Date().getFullYear()} </p>
        <p>Terms | Privacy | Legal</p>
      </section>
    </div>
  );
};

export default DashboardFooter;
