import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData(); // Fetching event data and error handling
  const [type, setType] = useState(null); // Managing the selected event type filter
  const [currentPage, setCurrentPage] = useState(1); // Managing the current page number for pagination

  // Filtering events based on the selected type (if any), or showing all events
  const filteredEvents = (
    (!type
      ? data?.events
      : data?.events.filter((event) =>
        event.type === type
      )) || []);

  // Calculating the total number of pages (rounded up) with math.ceil instead of math.floor
  const pageNumber = Math.ceil(filteredEvents.length / PER_PAGE);

  // Slicing the filtered events to only show the events for the current page
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  // Changing the filter type and resetting pagination to the first page
  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  // Creating a set of unique event types for the filter selector
  const typeList = new Set(data?.events.map((event) => event.type));

  console.log("data : ", data?.events); // Checking database.events existence 
  console.log("evenements filtrés : ", filteredEvents); // Checking filtering behavior with events
  console.log("type de filtre en cours: ", type); // Selected filter type



  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {paginatedEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
