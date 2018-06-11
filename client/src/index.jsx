import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import ModOne from './pricing_mod1/ModOne';
import ModTwo from './calendar_mod2/ModTwo';
import ModThree from './guests_mod3/ModThree';
import ModFour from './calculator_mod4/ModFour';
import { setStartOrEndDate, clearDates, calendarChange } from './calendar_mod2/CalendarLogic';
import { Holder, Button, Details } from './IndexStylings';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adults: 1,
      children: 0,
      infants: 0,
      totalGuests: 1,
      listingData: null,
      startDate: null,
      endDate: null,
      mod2Clicked: 'closed',
      mod3Clicked: false,
    };
    this.setStartOrEndDate = setStartOrEndDate.bind(this);
    this.clearDates = clearDates.bind(this);
    this.calendarChange = calendarChange.bind(this);
  }

  componentDidMount() {
    this.getListingData();
  }

  onGuestButtonClick = (guest, increment) => {
    const val = this.state[guest] + increment;
    const { totalGuests } = this.state;
    const total = totalGuests + increment;
    const { maxGuests } = this.state.listingData;
    // infants don't count towards the number of guests, but have a cap of 5
    if (guest === 'infants' && (val > 5 || val < 0)) {
      return;
    // there is a minimum of 1 adult guest
    } else if (guest === 'adults' && (val > maxGuests || val < 1 || total > maxGuests)) {
      return;
    } else if (guest === 'children' && (val > maxGuests || val < 0 || total > maxGuests)) {
      return;
    }
    this.setState({
      [guest]: val,
      totalGuests: guest === 'infants' ? totalGuests : total,
    });
  }

  onMod3InputHolderClick = () => {
    this.setState({
      mod3Clicked: !this.state.mod3Clicked,
    });
  }

  getListingData = () => {
    let id = window.location.pathname;
    if (id === '/') {
      id = 1;
    } else {
      id = id.replace(/\//g, '');
    }
    axios.get(`http://127.0.0.1:3002/rooms/${id}/bookingInfo/`)
      .then((response) => {
        this.setState({
          listingData: response.data,
        });
      })
      .catch(() => {
        console.log('there was an error!');
      });
  }

  render() {
    if (this.state.listingData) {
      return (
        <Holder
          startDate={this.state.startDate}
          endDate={this.state.endDate}
        >
          <ModOne
            price={this.state.listingData.pricePerNight}
            rating={this.state.listingData.starRating}
            numReviews={this.state.listingData.custRevNum}
          />
          <ModTwo
            dates={this.state.listingData.datesTaken}
            minStay={this.state.listingData.minStay}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            setDate={this.setStartOrEndDate}
            calendarChange={this.calendarChange}
            clicked={this.state.mod2Clicked}
            clearDates={this.clearDates}
          />
          <ModThree
            adult={this.state.adults}
            child={this.state.children}
            infant={this.state.infants}
            totalGuests={this.state.totalGuests}
            btnClick={this.onGuestButtonClick}
            maxGuests={this.state.listingData.maxGuests}
            clicked={this.state.mod3Clicked}
            close={this.onMod3InputHolderClick}
          />
          <ModFour
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            price={this.state.listingData.pricePerNight}
            cleaningFee={this.state.listingData.cleaningFee}
            maxGuests={this.state.listingData.maxGuests}
            serviceFee={this.state.listingData.serviceFee}
          />
          <Button> REQUEST TO BOOK </Button>
          <Details> You won’t be charged yet </Details>
        </Holder>
      );
    }
    return null;
  }
}

render(<App />, document.getElementById('root'));
