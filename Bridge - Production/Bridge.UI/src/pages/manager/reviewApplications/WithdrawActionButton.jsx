import React, { useState } from "react"
import ClickAwayListener from "react-click-away-listener";
import * as CONST from "./constant";
import * as GLOBAL_CONST from "../../../common/constants";
import DownArrowWhite from "../../../resources/DownWhite.svg";
import DownArrowBlue from "../../../resources/DownBlue.svg";

const WithdrawActionButton = (props) => {
	const {
		openWithdrawModal,
		handleConfirmationPopup,
		job,
		isDisabled = false
	} = props;
	const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false)
	return (
		<>
			<button
				className={`btn btn-update ${
					isActionsDropdownOpen ? "btn-hover" : ""
				}`}
				onClick={() => setIsActionsDropdownOpen(true)}
				disabled={isDisabled}
			>
				Actions
				<img
					src={isActionsDropdownOpen ? DownArrowWhite : DownArrowBlue}
					alt={"Down"}
					className={`${isActionsDropdownOpen ? "down-arrow-rotate" : ""}`}
				/>
			</button>
			{isActionsDropdownOpen && (
				<ClickAwayListener onClickAway={() => setIsActionsDropdownOpen(false)}>
					<div className="option-menu-wrapper">
						<ul className="option-menu">
							<li
								className="option-menu-items"
								onClick={() => {
									setIsActionsDropdownOpen(false)
									openWithdrawModal(job)
								}}
							>
								{CONST.DECLINE}
							</li>
							<li
								className="option-menu-items"
								onClick={() => {
									setIsActionsDropdownOpen(false)
									handleConfirmationPopup(
										GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM
											.Withdrawn,
										job
									)
								}
								}
							>
								{CONST.SCHEDULE_DISCUSSION}
							</li>
						</ul>
					</div>
				</ClickAwayListener>
			)}
		</>
	)
}

export default WithdrawActionButton;
