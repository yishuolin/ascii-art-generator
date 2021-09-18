import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { MAIN, MAIN_DARK } from '../util/Theme';

const Container = styled.div`
  margin-top: 50px;
  margin-left: 5%;
  color: ${MAIN};
  font-size: 15px;
  font-family: Verdana;
`;
const Title = styled.span`
  font-weight: bold;
  color: ${MAIN_DARK};
`;

const Step = ({ count, description }) => {
  return (
    <Container>
      <Title>Step {count}: </Title>
      {description}
    </Container>
  );
};

Step.propTypes = {
  count: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export { Step };
