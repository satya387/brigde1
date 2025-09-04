import React, { useState } from "react"
import ClickAwayListener from "react-click-away-listener";
import * as CONST from "./constant";
import DownArrowWhite from "../../../resources/DownWhite.svg";
import DownArrowBlue from "../../../resources/DownBlue.svg";

const ActionButton = (props) => {
	const {
		openWithdrawModal,
		openConfirmationModal,
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
									openConfirmationModal(job)
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

export default ActionButton;
