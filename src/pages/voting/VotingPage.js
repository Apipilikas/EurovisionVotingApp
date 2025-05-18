import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { BasePage } from "../BasePage";
import "./VotingPageStyles.css";
import {
  animated,
  config,
  useChain,
  useSpring,
  useSpringRef,
  useSprings,
  useTransition,
} from "@react-spring/web";
import { CountryRequests } from "../../utils/requestUtils";
import SimpleButton from "../../components/inputs/buttons/simpleButton/SimpleButton";
import { UpdateEffectText } from "../../components/effects/text/UpdateEffectText";
import {
  EventID,
  useSession,
} from "../../components/common/session/SessionProvider";
import { useRunningOrder } from "../../hooks/useRunningOrder";
import { useCountries } from "../../hooks/useCountries";
import Heart from "../../components/common/heart/Heart";

export const VotingPage = forwardRef((props, ref) => {
  const pageLoaded = () => {
    ref.current.pageLoaded();
  };

  return (
    <BasePage {...props} ref={ref}>
      <Main pageLoaded={pageLoaded} />
    </BasePage>
  );
});

function Main(props) {
  return <Carousel />;
}

function Carousel() {
  const {runningOrder} = useRunningOrder();
  const {countries, initialized} = useCountries();
  const [displayedCountries, setDisplayedCountries] = useState([]);
  const maxDisplayedCountries = 3;

  // Set displayed countries based on running Order
  useEffect(() => {
    if (runningOrder > -1) {
      let list = [];
      const emptyDisplayedComponents = maxDisplayedCountries - 1 - runningOrder;

      for (let i = 0; i < emptyDisplayedComponents; i++) list.push({ isEmpty: true });
      
      const startIndex = Math.max(0, runningOrder - 2);

      for (let i = startIndex; i <= runningOrder; i++)  list.push(countries[i]);
      
      setDisplayedCountries(list);
    }

  }, [runningOrder, initialized]);

  const transitions = useTransition(displayedCountries, {
    key: (item, index) => item?.runningOrder ?? `empty-${index}`,
    config: { tension: 120, friction: 26 },
    from: {
      opacity: 0,
      transform: "translateY(-100px) scale(0.0)",
      width: "0px",
      height: "0px",
      margin: "0em auto",
    },
    enter: {
      opacity: 1,
      transform: "translateY(0px) scale(1.0)",
      width: "125px",
      height: "125px",
      margin: "1em auto",
    },
    leave: {
      opacity: 0,
      transform: "translateY(-100px) scale(0.0)",
      width: "0px",
      height: "0px",
      margin: "0em",
    },
  });

  return (
    <animated.div className="countries-carousel-container">
      {transitions((style, country) => {
        if (country == null || country?.isEmpty)
          return (
            <animated.div
              className="empty-country"
              style={style}
            ></animated.div>
          );

        const isCurrent = parseInt(country.runningOrder) === runningOrder;

        return (
          <Country
            country={country}
            style={style}
            key={country.runningOrder}
            isCurrent={isCurrent}
          />
        );
      })}
    </animated.div>
  );
}

function Country({ country, isCurrent, ...props }) {

  const VOTE_TEXT = "VOTE";

  const [isOpen, setIsOpen] = useState(false);
  const [isDisplayTime, setIsDisplayTime] = useState(false);
  const [selectedVote, setSelectedVote] = useState(0);
  const { judge } = useSession();

  // If voting status == closed // DO NOTHING
  // If voting status == pending // About to start // Display
  // If voting status == open // open

  const { votingStatus } = country;

  useEffect(() => {
    if (!isCurrent) {
      setIsDisplayTime(false);
      setIsOpen(false);
      return;
    }
    switch (votingStatus) {
      case "OPEN":
        if (isDisplayTime) {
          // PENDING -> OPEN
          setIsDisplayTime(false);
        }
        break;
      case "PENDING":
      case "CLOSED":
        setIsDisplayTime(true);
        break;
    }
  }, [votingStatus, isCurrent]);

  useEffect(() => {
    if (judge != null) {
      let vote = country.votes[judge.code];
      let points = vote == null ? (isCurrent ? VOTE_TEXT : 0) : vote;
      setSelectedVote(points);
    }
  }, [judge]);

  // Country container
  const { height, width } = useSpring({
    from: {
      height: "125px",
      width: "125px",
    },
    to: {
      height: isCurrent ? "300px" : props.style.height,
      width: isCurrent ? "400px" : props.style.width,
    },
  });

  const upperContainerProps = useSpring({
    flexDirection: isOpen ? "row" : "column",
    config: { tension: 300, friction: 30 },
  });

  // Displayed container transition
  const displayTransition = useTransition(isDisplayTime ? 1 : 0, {

  });

  // Listeners
  const handleVotingItemClick = (vote) => {
    if (vote === selectedVote || vote === VOTE_TEXT) return;
    setSelectedVote(vote);
    CountryRequests.voteCountry(country.code, judge.code, vote);
  };

  return (
    <animated.div
      className={`country-container ${isCurrent ? "current-running" : ""}`}
      style={{ ...props.style, width: width, height: height }}
      onClick={() => setIsOpen((isOpen) => !isOpen)}
    >
      {displayTransition((style, item) => {
        if (item == 0) {
          return (
            <MainContainer
              style={style}
              selectedVote={selectedVote}
              onVoteClicked={(vote) => handleVotingItemClick(vote)}
              isCurrent={isCurrent}
              country={country}
            />
          );
        } else return <DisplayContainer country={country} style={style} />;
      })}
    </animated.div>
  );
}

function MainContainer({
  country,
  selectedVote,
  onVoteClicked,
  isCurrent,
  isClosing,
  ...props
}) {
  let isJudgeOriginCountry = false;
  const { judge } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [displayVotes, setDisplayVotes] = useState(false);
  const [displayCannotVote, setDisplayCannotVote] = useState(false);

  useEffect(() => {
    isJudgeOriginCountry = judge?.originCountry == country.code;
    setDisplayVotes(isCurrent || !isJudgeOriginCountry);
    setDisplayCannotVote(isCurrent && isJudgeOriginCountry);
    // if (isCurrent && selectedVote == 0) setIsOpen(true);
  }, [judge, isCurrent]);

  const springRef = useSpringRef();

  const votes = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];

  const { ...votingItemRest } = useSpring({
    ref: springRef,
    config: config.slow,
    from: { width: "10%", height: "10%" },
    to: {
      width: isOpen ? "100%" : "10%",
      height: isOpen ? "100%" : "10%",
    },
    // delay : 1000
  });

  const f = selectedVote == "VOTE"

  const transRef = useSpringRef();
  const votingTransition = useTransition(
    isOpen ? (isCurrent ? votes : [selectedVote]) : isCurrent && selectedVote == 0 ? 1 : [selectedVote],
    {
      ref: transRef,
      trail: 400 / votes.length,
      from: { opacity: 0, scale: 0, width: "0px", height: "0px", background : country.flagColor1, color : country.flagColor2 },
      enter: { opacity: 1, scale: 1, width: "50px", height: "50px", background : country.flagColor1, color : country.flagColor2 },
      leave: { opacity: 0, scale: 0, width: "0px", height: "0px" },
    }
  );

  const {margin} = useSpring({
    from : {margin : "0em 0em"},
    to : {margin : isOpen ? "1em 0em" : "0em 0em"}
  })

  useChain(isOpen ? [springRef, transRef] : [transRef, springRef], [
    0,
    isOpen ? -100.0 : 0.2,
  ]);

  const displayTransition = useTransition(displayVotes ? 1 : 0, {
    from: { opacity: 0, scale: 0, height: "0%", background : displayVotes ? country.flagColor2 : country.flagColor1, color : country.flagColor2 },
    enter: { opacity: 1, scale: 1, height: "100%", background : displayVotes ? country.flagColor2 : country.flagColor1, color : country.flagColor2 },
    leave: { opacity: 0, scale: 0, height: "0%" },
  });

  const handleVotingContainerClick = () => {
    if (isCurrent) setIsOpen((isOpen) => !isOpen);
  };

  const handleContainerClick = () => {
    if (!isCurrent) setDisplayVotes((displayVotes) => !displayVotes);
  };

  return (
    <animated.div
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
      onClick={() => handleContainerClick()}
    >
      <UpperContainer
        isCurrent={isCurrent}
        country={country}
      />
      {displayTransition((displayStyle, item) => {
        if (item == 1) {
          if (displayCannotVote) {
            return <p className="cannot-vote-caption" style={{color : country.flagColor1}}>Cannot vote!</p>;
          } else {
            return (
              <animated.div
                className="voting-container"
                onClick={() => handleVotingContainerClick()}
                style={
                  isCurrent
                    ? votingItemRest
                    : { ...displayStyle, display: isCurrent ? "grid" : "flex" }
                }
              >
                {votingTransition((style, item) => (
                  <animated.div
                    className="voting-item"
                    style={{
                      ...style,
                      margin: isCurrent ? margin : "auto",
                    }}
                    onClick={() => onVoteClicked(item)}
                  >
                    <span>{item}</span>
                  </animated.div>
                ))}
              </animated.div>
            );
          }
        } else {
          return (
            <animated.div
              style={displayStyle}
              className="display-total-votes-container"
            >
              <div className="display-total-votes"
                                style={{color:country.flagColor2}}>
                <span>{country.totalVotes}</span>
              </div>
            </animated.div>
          );
        }
      })}
    </animated.div>
  );
}

function UpperContainer({
  isCurrent,
  country,
  ...props
}) {

  const {flagColor1, flagColor2, runningOrder, name, totalVotes} = country;

  const containerStyle = useSpring({
    config: { tension: 300, friction: 10 },
    from: {
      backgroundColor : flagColor1,
      height: "0px",
    },
    to: {
      height: isCurrent ? "50px" : "30px",
    },
  });

  const countryNameStyle = useSpring({
    config: { tension: 300, friction: 100 },
    from: {
      width: "0%",
      transform: "scale(0.0)",
      margin: "auto",
      fontSize: "0em",
      textAlign: "center",
      color: flagColor2,
    },
    to: {
      transform: "scale(1.0)",
      width: "100%",
      fontSize: isCurrent ? "1.7" : "0.9em",
    },
    delay: 3000,
  });

  const runningOrderContainerStyle = useSpring({
    config: config.stiff,
    from: {
      height: "100%",
      position: "absolute",
      display: "flex",
      backgroundColor: flagColor2,
    },
    to: {
      // opacity : isOpen ? 1 : 0,
      backgroundColor: isCurrent ? "transparent" : flagColor2,
    },
  });

  const runningOrderStyle = useSpring({
    config: config.stiff,
    from: {
      margin: "auto",
      marginRight: "0em",
      fontSize: "0em",
      fontWeight: 800,
      padding: "0em 0.1em",
      color: flagColor1,
      padding: "0em 0em",
    },
    to: {
      // opacity : isOpen ? 1 : 0,
      fontSize: isCurrent ? "0em" : "0.8em",
      padding: isCurrent ? "0em 0em" : "0em 0.5em",
    },
  });

  const runningOrderCornerStyle = useSpring({
    config: config.stiff,
    from: {
      marginLeft: "0px",
      width: "50px",
      background:
        `linear-gradient(to bottom right, transparent 50%, ${flagColor1} 50%)`,
    },
    to: {
      marginLeft: isCurrent ? "20px" : "0px",
      width: isCurrent ? "50px" : "0px",
      background:
        `linear-gradient(to bottom right, transparent 50%, ${flagColor1} 50%)`,
    },
  });

  const countryImageStyle = useSpring({
    config: config.stiff,
    from: {
      height: "0px",
    },
    to: {
      // opacity : isOpen ? 1 : 0,
      height: isCurrent ? "50px" : "30px",
    },
  });

  const totalVotesContainerStyle = useSpring({
    config: { tension: 300, friction: 150 },
    from: {
      width: "100%",
      zIndex: 2,
    },
    to: {
      // opacity : isOpen ? 1 : 0,
      width: isCurrent ? "25%" : "0%",
    },
    delay: 1000,
  });

  const totalVotesStyle = useSpring({
    config: config.stiff,
    from: {
      width: "0px",
      textAlign: "center",
      fontSize: "0em",
      fontWeight: "800",
      color: flagColor1,
      margin: "auto",
    },
    to: {
      // opacity : isOpen ? 1 : 0,
      fontSize: isCurrent ? "1.5em" : "0em",
      width: isCurrent ? "50px" : "0px",
    },
    delay: 1000,
  });

  const totalVotesCornerStyle = useSpring({
    config: config.stiff,
    from: {
      width: "50px",
      background: `linear-gradient(to top left, transparent 50%, ${flagColor1} 50%)`,
    },
    to: {
      background: isCurrent
        ? `linear-gradient(to top left, transparent 50%, ${flagColor1} 50%)`
        : `linear-gradient(to top left, transparent 100%, ${flagColor1} 100%)`,
    },
    delay: 1000,
  });
  
  return (
    <animated.div className="voting-upper-container" style={containerStyle}>
      <animated.img
        className="country-image"
        src={`../../images/flags/${country.code}.svg`}
        height="30px"
        style={countryImageStyle}
      />
      <animated.div
        className="running-order-container"
        style={runningOrderContainerStyle}
      >
        <animated.span
          className="country-running-order"
          style={runningOrderStyle}
        >
          {runningOrder}
        </animated.span>
        <animated.span
          className="corner-item"
          style={runningOrderCornerStyle}
        ></animated.span>
      </animated.div>
      <animated.span className="country-name" style={countryNameStyle}>
        {name}
      </animated.span>
      <animated.div
        className="total-votes-container"
        style={totalVotesContainerStyle}
      >
        <animated.span
          className="corner-item"
          style={totalVotesCornerStyle}
        ></animated.span>
        <animated.span className="country-total-votes" style={totalVotesStyle}>
          {totalVotes}
        </animated.span>
      </animated.div>
    </animated.div>
  );
}

function DisplayContainer({country, ...props }) {
  const [showDisplayText, setShowDisplayText] = useState(true);
  const [text, setText] = useState("Moving to");
  const [showSinger, setShowSinger] = useState(false);
  const [showSong, setShowSong] = useState(false);

  useEffect(() => {
    startDisplay();
  }, []);

  const startDisplay = () => {
    setTimeout(() => {
      setShowDisplayText(false);
    }, 3000);

    setTimeout(() => {
      setShowSinger(true);
    }, 4000);

    setTimeout(() => {
      setShowSong(true);
    }, 5000);

    setTimeout(() => {
      setText("Get ready to vote for");
      setShowDisplayText(true);
    }, 7000);
  };

  const backgroundStyle = `
  .country-display-container .country-name {
    background: linear-gradient(to right, ${country.flagColor1} 20%, ${country.flagColor2} 30%, ${country.flagColor3} 70%, ${country.flagColor1} 80%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 500% auto;
    animation: text-animation 5s ease-in-out infinite alternate;
  }
`;

  return (
    <animated.div style={props.style} className="country-display-container">
      <FadeOutSpan className="display-text" show={showDisplayText}>
        {text}
      </FadeOutSpan>
      <style>{backgroundStyle}</style>
      <span className="country-name" 
            >{country.name}</span>
      <div className="details-container">
        <FadeOutSpan className="artist-text" show={showSinger}>{country.artist}</FadeOutSpan>
        <FadeOutSpan className="song-text" show={showSong}>{country.song}</FadeOutSpan>
      </div>
      <FadeOutSpan show={true}>
        <Heart color1={country.flagColor1} color2={country.flagColor2} color3={country.flagColor3} color4={country.flagColor1}/>
      </FadeOutSpan>
    </animated.div>
  );
}

function FadeOutSpan({ children, show, ...props }) {
  const fadeOutStyles = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: show ? 1 : 0,
    },
    config: { tension: 300, friction: 24 },
  });

  return (
    <animated.div {...props} style={fadeOutStyles}>
      {children}
    </animated.div>
  );
}
