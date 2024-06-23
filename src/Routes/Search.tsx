import { useQuery } from "react-query";
import { IGetMoviesResult, IGetSearchResult, getLastestMovies, getMovies, getSearch, getTopMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate, PathMatch, useLocation } from "react-router-dom";
import { MdInfoOutline } from "react-icons/md";
import queryString from "query-string";


const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 60vh; 
  display: flex ;
  flex-direction: column;
  justify-content: center;
  padding: 50px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 18px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  padding-bottom: 250px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);  
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div) <{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  height: 200px;  
  font-size: 66px;  
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 16px;
  }
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 70vh;
  top: 0;
  left: 0;
  right: 0;  
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div<{ bgPhoto: string }>`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
  background-image: linear-gradient(to top, black, transparent), url(${(props) => props.bgPhoto});
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  text-align: center;
  font-size: 28px;
  position: relative;
  padding: 10px;
  top: -60px;
`;

const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -60px;
`;

const SliderTitle = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  font-size: 48px;
  p {    
    color: ${(props) => props.theme.white.lighter};
    position: relative;
    font-size: 20px;
    cursor: pointer;
  }
`;

const BannerButton = styled.button`
  width: 160px;
  height: 50px;
  user-select: none;
  cursor: pointer;
  background: ${(props) => props.theme.white.lighter};
  border: none;
  border-radius: 10px;
  font-size: 16px;
  line-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;  
  transition: all 0.3s ease-in-out;
  margin-top: 20px;
  svg {
    font-size: 20px;
  }  
  &:hover {
    scale: 1.1;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  }
}

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.3,
      duaration: 0.3,
      type: "tween"
    },
  },
}

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duaration: 0.3,
      type: "tween"
    },
  },
}

const offset = 6;

function Home() {
  const navigate = useNavigate();
  const location = useLocation();  
  const { keyword, id } = queryString.parse(location.search);
  const bigSearchMatch: PathMatch<string> | null = useMatch("/movies/:movieId");
  const { data, isLoading } = useQuery<IGetSearchResult>(["search", keyword], () => getSearch(String(keyword)));
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (searchId: number) => {
    navigate(`/search?keyword=${keyword}`);
  };
  const onOverlayClick = () => navigate(-1);
  const clickedSearch = bigSearchMatch?.params.searchId && data?.results.find(search => search.id + "" === bigSearchMatch.params.searchId);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>
              {data?.results[0].name}
            </Title>
            <Overview>
              {data?.results[0].overview}
            </Overview>
            <BannerButton
              onClick={() =>
                onBoxClicked(Number(data?.results[0].id))
              }
            >
              <MdInfoOutline />
              상세정보
            </BannerButton>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <SliderTitle>Now Playing<p onClick={incraseIndex} >다음</p></SliderTitle>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results.slice(1).slice(offset * index, offset * index + offset).map((search) => (
                  <Box
                    key={search.id}
                    whileHover="hover"
                    initial="normal"
                    variants={boxVariants}
                    transition={{ type: "tween" }}
                    onClick={() => onBoxClicked(search.id)}
                    layoutId={search.id + "n"}
                    bgPhoto={makeImagePath(search.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>{search.name}</h4>
                    </Info>
                  </Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <AnimatePresence>
            {bigSearchMatch ? (
              <>
                <Overlay onClick={onOverlayClick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                {clickedSearch ?
                  <BigMovie layoutId={bigSearchMatch.params.searchId + "n"}>
                    <BigCover bgPhoto={makeImagePath(clickedSearch.backdrop_path, "w500")} />
                    <BigTitle>{clickedSearch.name}</BigTitle>
                    <BigOverview>개봉 : {clickedSearch.first_air_date}</BigOverview>
                    <BigOverview>평점 : {clickedSearch.vote_average}</BigOverview>
                    <BigOverview>{clickedSearch.overview}</BigOverview>
                  </BigMovie> : null}
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;