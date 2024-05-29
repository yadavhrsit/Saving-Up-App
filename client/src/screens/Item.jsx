import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../constants/api";
import axios from "axios";

function Item() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("saving_up_token");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/item/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const url =
    data.item.url.startsWith("http://") || data.item.url.startsWith("https://")
      ? data.item.url
      : `http://${data.item.url}`;

  return (
    <div className="container mx-auto p-4">
      {data && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4 w-full">
          <div className="flex items-center mb-6">
            <img
              className="w-32 h-32 object-cover rounded-lg shadow-lg"
              src={data.item.image}
              alt={data.item.name}
            />
            <div className="ml-6">
              <h1 className="text-3xl font-bold mb-2 dark:text-white">
                {data.item.name}
              </h1>
              <a
                href={url}
                target="_blank"
                className="text-gray-600 dark:text-gray-300"
                rel="noreferrer"
              >
                <span className="font-bold">
                  Click to view on marketplace :{" "}
                </span>{" "}
                <br />
                <span className=" italic">{url}</span>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <h2 className="font-bold text-lg mb-2 dark:text-white">
                Target Amount
              </h2>
              <p className="text-gray-800 dark:text-gray-200">
                {data.item.targetAmount}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <h2 className="font-bold text-lg mb-2 dark:text-white">
                Contributed Amount
              </h2>
              <p className="text-gray-800 dark:text-gray-200">
                {data.item.contributedAmount}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <h2 className="font-bold text-lg mb-2 dark:text-white">
                Remaining Amount
              </h2>
              <p className="text-gray-800 dark:text-gray-200">
                {data.item.remainingAmount}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <h2 className="font-bold text-lg mb-2 dark:text-white">
                Contribution Frequency
              </h2>
              <p className="text-gray-800 dark:text-gray-200 capitalize">
                {data.item.contributionFrequency}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <h2 className="font-bold text-lg mb-2 dark:text-white">
                Next Payment Date
              </h2>
              <p className="text-gray-800 dark:text-gray-200">
                {new Date(data.item.nextPaymentDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="font-bold text-2xl mb-4 dark:text-white">
              Upcoming Contributions
            </h2>
            {data.item.contributionDates &&
            data.item.contributionDates.length > 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-4">
                {data.item.contributionDates.map((date) => (
                  <div
                    key={date}
                    className="mb-4 p-4 rounded-lg border dark:border-gray-700"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-lg font-bold dark:text-white">
                        Amount: ${data.item.contributionAmount}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {new Date(date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No Upcoming contributions.
              </p>
            )}
          </div>
          <div className="mt-6">
            <h2 className="font-bold text-2xl mb-4 dark:text-white">
              Contributions
            </h2>
            {data.contributions && data.contributions.length > 0 ? (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md p-4">
                {data.contributions.map((contribution) => (
                  <div
                    key={contribution._id}
                    className="mb-4 p-4 rounded-lg border dark:border-gray-700"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-lg font-bold dark:text-white">
                        Amount: ${contribution.amount}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {new Date(contribution.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      Next Payment Date:{" "}
                      {new Date(
                        contribution.nextPaymentDate
                      ).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No contributions yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Item;
